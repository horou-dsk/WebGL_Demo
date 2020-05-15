import {vec3, glMatrix, mat4} from 'gl-matrix'
import {canvas} from '../init'

const YAW         = -90.0
const PITCH       =  0.0
const SPEED       =  0.01
const SENSITIVITY =  0.1
const ZOOM        =  45.0

let downKey = ''

export default class Camera {

  Position: vec3
  Front: vec3 = vec3.set(vec3.create(), 0, 0, -1)
  Up = vec3.create()
  Right = vec3.create()
  WorldUp: vec3

  Yaw: number

  Pitch: number

  MovementSpeed = SPEED

  MouseSensitivity = SENSITIVITY

  Zoom = ZOOM

  constructor(position = vec3.set(vec3.create(), 0, 0, 0), up = vec3.set(vec3.create(), 0, 1, 0), yaw = YAW, pitch = PITCH) {
    this.Position = position
    this.WorldUp = up
    this.Yaw = yaw
    this.Pitch = pitch
    this.updateCameraVectors()
    window.addEventListener('keydown', event => {
      downKey = event.key
    })
    window.addEventListener('keyup', event => {
      downKey = ''
    })
    /*canvas.addEventListener('mousemove', event => {
      const w2 = canvas.width / 2
      const h2 = canvas.height / 2
      this.Yaw = YAW + (event.offsetX - w2) * 60 / w2
      this.Pitch = PITCH - (event.offsetY - h2) * 60 / h2
      this.updateCameraVectors()
      // console.log(event.offsetX, event.offsetY)
    })*/
    const mousemove = (event) => {
      const { movementX, movementY } = event
      const offsetX = movementX * this.MouseSensitivity
      const offsetY = movementY * this.MouseSensitivity
      this.Yaw += offsetX
      this.Pitch -= offsetY
      if (this.Pitch > 89) {
        this.Pitch = 89
      } else if (this.Pitch < -89) {
        this.Pitch = -89
      }
      this.updateCameraVectors()
    }
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock()
    })
    document.addEventListener('pointerlockchange', event => {
      if (document.pointerLockElement == canvas) {
        document.addEventListener('mousemove', mousemove, false)
      } else {
        document.removeEventListener('mousemove', mousemove, false)
      }
    })
  }

  public processInput(deltaTime: number) {
    const velocity = this.MovementSpeed * deltaTime
    switch (downKey) {
      case 'W':
        vec3.add(this.Position, this.Position, vec3.scale(vec3.create(), this.Front, velocity))
        break
      case 'S':
        vec3.sub(this.Position, this.Position, vec3.scale(vec3.create(), this.Front, velocity))
        break
      case 'A':
        vec3.sub(this.Position, this.Position, vec3.scale(vec3.create(), this.Right, velocity))
        break
      case 'D':
        vec3.add(this.Position, this.Position, vec3.scale(vec3.create(), this.Right, velocity))
        break
    }
  }

  public getViewMatrix() {
    return mat4.lookAt(mat4.create(), this.Position, vec3.add(vec3.create(), this.Position, this.Front), this.Up)
  }

  private updateCameraVectors() {
    const front = vec3.create()
    vec3.set(front,
      Math.cos(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch)),
      Math.sin(glMatrix.toRadian(this.Pitch)),
      Math.sin(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch))
      )
    vec3.normalize(this.Front, front)
    vec3.normalize(this.Right, vec3.cross(vec3.create(), this.Front, this.WorldUp))
    vec3.normalize(this.Up, vec3.cross(vec3.create(), this.Right, this.Front))
  }
}
