import { Controller } from './nes-lib'

window.addEventListener("gamepadconnected", gamepadHandler)

let gamepad: Gamepad
let pressIndexs = new Set<number>()
const player = 1

function gamepadHandler(e) {
  gamepad = e.gamepad
}

function nesKeyboard(callback, keyCode) {
  switch(keyCode){
    case 12: // UP
      callback(player, Controller.BUTTON_UP); break;
    case 13: // Down
      callback(player, Controller.BUTTON_DOWN); break;
    case 14: // Left
      callback(player, Controller.BUTTON_LEFT); break;
    case 15: // Right
      callback(player, Controller.BUTTON_RIGHT); break;
    case 0: // 'a' - qwerty, dvorak
    case 1: // 'q' - azerty
      callback(player, Controller.BUTTON_A); break;
    case 2: // 's' - qwerty, azerty
    case 3: // 'o' - dvorak
      callback(player, Controller.BUTTON_B); break;
    case 8: // Tab
      callback(player, Controller.BUTTON_SELECT); break;
    case 9: // Return
      callback(player, Controller.BUTTON_START); break;
    default: break;
  }
}
let lastUpdateTime = Date.now()
export default function handleGamePad(nes) {
  gamepad = navigator.getGamepads()[0]
  if (!gamepad) return
  let currentTime = Date.now()
  let deltaTime = currentTime - lastUpdateTime
  const L1_X = gamepad.axes[0]
  const L1_Y = gamepad.axes[1]
  if (L1_X > 0.5) {
    nesKeyboard(nes.buttonDown, 15)
  } else {
    nesKeyboard(nes.buttonUp, 15)
  }
  if (L1_X < -0.5) {
    nesKeyboard(nes.buttonDown, 14)
  } else {
    nesKeyboard(nes.buttonUp, 14)
  }
  if (L1_Y > 0.5) {
    nesKeyboard(nes.buttonDown, 13)
  } else {
    nesKeyboard(nes.buttonUp, 13)
  }
  if (L1_Y < -0.5) {
    nesKeyboard(nes.buttonDown, 12)
  } else {
    nesKeyboard(nes.buttonUp, 12)
  }

  gamepad.buttons.forEach((value, index) => {
    if (value.pressed) {
      if (!pressIndexs.has(index)) {
        pressIndexs.add(index)
      }
      nesKeyboard(nes.buttonDown, index)
      if (index === 3 || index === 1) {
        if (deltaTime >= 1000 / 30) {
          nesKeyboard(nes.buttonDown, index)
          lastUpdateTime = currentTime
        } else {
          nesKeyboard(nes.buttonUp, index)
        }
      }
    } else {
      if (pressIndexs.has(index)) {
        pressIndexs.delete(index)
        nesKeyboard(nes.buttonUp, index)
      }
    }
  })
}
