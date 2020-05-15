import { gl } from "../init";
import {mat3, mat4, vec3} from 'gl-matrix'

function makeShader(shaderSource: string, type: GLenum) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  const infoLog = gl.getShaderInfoLog(shader)
  if (infoLog) console.log(infoLog)
  return shader
}

export default class Shader {
  public ID: WebGLProgram

  constructor(private vertexShader: string, private fragmentShader: string) {
    const vertex = makeShader(vertexShader, gl.VERTEX_SHADER)
    const fragment = makeShader(fragmentShader, gl.FRAGMENT_SHADER)
    const ID = gl.createProgram()
    gl.attachShader(ID, vertex)
    gl.attachShader(ID, fragment)
    gl.linkProgram(ID)
    const infoLog = gl.getProgramInfoLog(ID)
    if (infoLog) console.log(infoLog)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    this.ID = ID
  }

  public use() {
    gl.useProgram(this.ID)
  }

  public setInt(name: string, value: number) {
    gl.uniform1i(gl.getUniformLocation(this.ID, name), value)
  }

  public setVec3(name: string, x: number, y: number, z: number) {
    gl.uniform3f(gl.getUniformLocation(this.ID, name), x, y, z)
  }

  public setVec3v(name: string, v3: vec3) {
    gl.uniform3fv(gl.getUniformLocation(this.ID, name), v3)
  }

  public setMat4(name: string, m4: mat4) {
    gl.uniformMatrix4fv(gl.getUniformLocation(this.ID, name), false, m4)
  }

  public setMat3(name: string, m3: mat3) {
    gl.uniformMatrix3fv(gl.getUniformLocation(this.ID, name), false, m3)
  }
}
