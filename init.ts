export const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
canvas.width = 256
canvas.height = 240
export const gl = canvas.getContext('webgl2')
