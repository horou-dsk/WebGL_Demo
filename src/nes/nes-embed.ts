import { NES, Controller } from './nes-lib'
import {render, setImageData} from './render'
import game from './roms/rxgd.nes'

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const FRAMEBUFFER_SIZE = SCREEN_WIDTH*SCREEN_HEIGHT;

let image = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT)
let framebuffer_u8: Uint8ClampedArray, framebuffer_u32: Uint32Array;

const AUDIO_BUFFERING = 512;
const SAMPLE_COUNT = 4*1024;
const SAMPLE_MASK = SAMPLE_COUNT - 1;
const audio_samples_L = new Float32Array(SAMPLE_COUNT);
const audio_samples_R = new Float32Array(SAMPLE_COUNT);
let audio_write_cursor = 0, audio_read_cursor = 0;


const nes = new NES({
  onFrame: function(framebuffer_24){
    for(let i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
  },
  onAudioSample: function(l, r){
    audio_samples_L[audio_write_cursor] = l;
    audio_samples_R[audio_write_cursor] = r;
    audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
  },
})

function onAnimationFrame(){
  window.requestAnimationFrame(onAnimationFrame);
  image.data.set(framebuffer_u8);
  setImageData(image)
  render()
  nes.frame();
}

function audio_remain(){
  return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

function audio_callback(event){
  const dst = event.outputBuffer;
  const len = dst.length;

  // Attempt to avoid buffer underruns.
  if(audio_remain() < AUDIO_BUFFERING) nes.frame();

  const dst_l = dst.getChannelData(0);
  const dst_r = dst.getChannelData(1);
  for(let i = 0; i < len; i++){
    const src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
    dst_l[i] = audio_samples_L[src_idx];
    dst_r[i] = audio_samples_R[src_idx];
  }

  audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

function keyboard(callback, event){
  const player = 1;
  switch(event.keyCode){
    case 38: // UP
      callback(player, Controller.BUTTON_UP); break;
    case 40: // Down
      callback(player, Controller.BUTTON_DOWN); break;
    case 37: // Left
      callback(player, Controller.BUTTON_LEFT); break;
    case 39: // Right
      callback(player, Controller.BUTTON_RIGHT); break;
    case 65: // 'a' - qwerty, dvorak
    case 81: // 'q' - azerty
      callback(player, Controller.BUTTON_A); break;
    case 83: // 's' - qwerty, azerty
    case 79: // 'o' - dvorak
      callback(player, Controller.BUTTON_B); break;
    case 9: // Tab
      callback(player, Controller.BUTTON_SELECT); break;
    case 13: // Return
      callback(player, Controller.BUTTON_START); break;
    default: break;
  }
}

function nes_init(){
  const buffer = new ArrayBuffer(image.data.length);
  framebuffer_u8 = new Uint8ClampedArray(buffer);
  framebuffer_u32 = new Uint32Array(buffer);

  // Setup audio.
  const audio_ctx = new window.AudioContext();
  const script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
  script_processor.addEventListener('audioprocess', audio_callback);
  script_processor.connect(audio_ctx.destination);
}

function nes_boot(rom_data){
  nes.loadROM(rom_data);
  window.requestAnimationFrame(onAnimationFrame);
}

/*function nes_load_data(canvas_id, rom_data){
  nes_init(canvas_id);
  nes_boot(rom_data);
}*/

function nes_load_url(path){
  nes_init();

  var req = new XMLHttpRequest();
  req.open("GET", path);
  req.overrideMimeType("text/plain; charset=x-user-defined");
  req.onerror = () => console.log(`Error loading ${path}: ${req.statusText}`);

  req.onload = function() {
    if (this.status === 200) {
      nes_boot(this.responseText);
    } else if (this.status === 0) {
      // Aborted, so ignore error
    } else {
      // @ts-ignore
      req.onerror();
    }
  };

  req.send();
}

document.addEventListener('keydown', (event) => {keyboard(nes.buttonDown, event)});
document.addEventListener('keyup', (event) => {keyboard(nes.buttonUp, event)});
window.addEventListener('load', () => {
  // console.log(wall_image)
  // console.log(game)
  nes_load_url(game)
/*  document.getElementById('pause-btn').addEventListener('click', () => {
    pause = !pause
  })*/
})
