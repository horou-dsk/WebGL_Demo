export const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
canvas.width = 256 * 4
canvas.height = 240 * 4
export const gl = canvas.getContext('webgl2')
