import {gl} from '../init'
import wallhaven_image from '../image/wallhaven-n61px0.jpg'
import vertex from './textureVertex1.glsl'
import fragment from './textureFragment1.glsl'
import Shader from '../lib/shader'
import {glMatrix, mat4, vec3} from 'gl-matrix'

function main() {
  const img = new Image()
  img.src = wallhaven_image
  img.onload = () => {
    render(img)
  }
}

const texCoord = new Float32Array([
  0.0,  0.0,
  1.0,  0.0,
  0.0,  1.0,
  0.0,  1.0,
  1.0,  0.0,
  1.0,  1.0
])

function render(image: HTMLImageElement) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // 设置纹理环绕方式
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

  const shader = new Shader(vertex, fragment)
  const VAO = gl.createVertexArray()
  const positionBuffer = gl.createBuffer()
  gl.bindVertexArray(VAO)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW)
  // setRectangle(gl, -1, -1, 1, 1)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(0)

  const texCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, texCoord, gl.STATIC_DRAW)
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(2)

  shader.use()
  shader.setInt('texture1', 0)

  // gl.enableClientState()

  const trans = mat4.create()
  mat4.identity(trans)
  mat4.rotate(trans, trans, glMatrix.toRadian(-30), vec3.set(vec3.create(), 0, 0, 1))
  mat4.scale(trans, trans, vec3.set(vec3.create(), 0.7, 0.7, 0.7))
  shader.setMat4('transform', trans)

  const draw = () => {
    gl.clearColor(0.1, 0.1, 0.1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    // gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bindVertexArray(VAO)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    requestAnimationFrame(draw)
  }
  draw()
}

main()
