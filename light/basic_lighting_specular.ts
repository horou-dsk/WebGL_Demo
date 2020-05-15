import {canvas, gl} from '../init'
import colors_vs from './1.colors.vs.glsl'
import colors_fs from './1.colors.fs.glsl'
import lamp_vs from './1.lamp.vs.glsl'
import lamp_fs from './1.lamp.fs.glsl'
import Camera from '../lib/camera'
import {glMatrix, mat3, mat4, vec3} from 'gl-matrix'
import Shader from '../lib/shader'

const camera = new Camera(vec3.set(vec3.create(), 0, 0, 6))

const lightPos = vec3.create()
vec3.set(lightPos, 1.2, 1.0, 2.0)

gl.enable(gl.DEPTH_TEST)

const lightingShader = new Shader(colors_vs, colors_fs)
const lampShader = new Shader(lamp_vs, lamp_fs)

const vertices = new Float32Array([
  -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
  0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
  0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
  0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
  -0.5,  0.5, -0.5,  0.0,  0.0, -1.0,
  -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,

  -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
  0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
  0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
  0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
  -0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
  -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,

  -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
  -0.5,  0.5, -0.5, -1.0,  0.0,  0.0,
  -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
  -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
  -0.5, -0.5,  0.5, -1.0,  0.0,  0.0,
  -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,

  0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
  0.5,  0.5, -0.5,  1.0,  0.0,  0.0,
  0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
  0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
  0.5, -0.5,  0.5,  1.0,  0.0,  0.0,
  0.5,  0.5,  0.5,  1.0,  0.0,  0.0,

  -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
  0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
  0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
  0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
  -0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
  -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,

  -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
  0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
  0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
  0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
  -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
  -0.5,  0.5, -0.5,  0.0,  1.0,  0.0
])

const VBO = gl.createBuffer()
const cubeVAO = gl.createVertexArray()

gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

gl.bindVertexArray(cubeVAO)
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0)
gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 4 * 3)
gl.enableVertexAttribArray(1)

const lightVAO = gl.createVertexArray()
gl.bindVertexArray(lightVAO)
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0)
gl.enableVertexAttribArray(0)

let deltaTime = 0
let lastFrame = 0
let index = 0
function draw() {
  const currentFrame = Date.now()
  deltaTime = currentFrame - lastFrame
  lastFrame = currentFrame
  gl.clearColor(0.1, 0.1, 0.1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  lightingShader.use()
  lightingShader.setVec3("objectColor", 1.0, 0.5, 0.31)
  lightingShader.setVec3("lightColor",  1.0, 1.0, 1.0)
  lightingShader.setVec3v("lightPos", lightPos)

  const projection = mat4.create()
  mat4.perspective(projection, glMatrix.toRadian(camera.Zoom), canvas.width / canvas.height, 0.1, 100)
  const view = camera.getViewMatrix()
  lightingShader.setMat4("projection", projection)
  lightingShader.setMat4("view", view)

  const model = mat4.create()
  mat4.identity(model)
  mat4.rotate(model, model, index += 0.02, vec3.set(vec3.create(), 1, 1, 0))
  lightingShader.setMat4('model', model)
  // 计算法线矩阵光照
  const normalMat = mat3.create()
  const m4 = mat4.create()
  mat4.transpose(m4, mat4.invert(m4, model))
  mat3.fromMat4(normalMat, m4)
  lightingShader.setMat3('normalMat', normalMat)

  gl.bindVertexArray(cubeVAO)
  gl.drawArrays(gl.TRIANGLES, 0, 36)

  lampShader.use()
  lampShader.setMat4("projection", projection)
  lampShader.setMat4("view", view)
  mat4.identity(model)
  mat4.translate(model, model, lightPos)
  mat4.scale(model, model, vec3.set(vec3.create(), 0.2, 0.2, 0.2))
  lampShader.setMat4('model', model)

  gl.bindVertexArray(lightVAO)
  gl.drawArrays(gl.TRIANGLES, 0, 36)

  camera.processInput(deltaTime)
  requestAnimationFrame(draw)
}
draw()
