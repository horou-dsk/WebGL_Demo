const canvas = document.getElementById('myCanvas') as HTMLCanvasElement

canvas.width = 256 * 4
canvas.height = 240 * 4

const ctx = canvas.getContext('2d')

type vec2 = { x: number, y: number }

function vec2(x: number, y: number): vec2 {
  return {
    x,
    y
  }
}

function vecMul(v1: vec2, v2: vec2 | number) {
  let x, y
  if (typeof v2 === 'object') {
    x = v2.x
    y = v2.y
  } else {
    x = v2
    y = v2
  }
  return {
    x: v1.x * x,
    y: v1.y * y
  }
}

function vecSub(v1: vec2, v2: vec2 | number) {
  let x, y
  if (typeof v2 === 'object') {
    x = v2.x
    y = v2.y
  } else {
    x = v2
    y = v2
  }
  return {
    x: v1.x - x,
    y: v1.y - y
  }
}

function vecAbs(v1: vec2) {
  return {
    x: Math.abs(v1.x),
    y: Math.abs(v1.y)
  }
}

function vecDiv(v1: vec2, v2: vec2 | number) {
  let x, y
  if (typeof v2 === 'object') {
    x = v2.x
    y = v2.y
  } else {
    x = v2
    y = v2
  }
  return {
    x: v1.x / x,
    y: v1.y / y
  }
}

function vecAdd(v1: vec2, v2: vec2 | number) {
  let x, y
  if (typeof v2 === 'object') {
    x = v2.x
    y = v2.y
  } else {
    x = v2
    y = v2
  }
  return {
    x: v1.x + x,
    y: v1.y + y
  }
}

function CRTCurveUV(uv: vec2) {
  uv = vecSub(vecMul(uv, 2.0), 1.0)
  const offset = vecDiv(vecAbs(vec2(uv.y, uv.x)), vec2( 6.0, 4.0 ))
  uv = vecAdd(uv, vecMul(uv, vecMul(offset, offset)))
  uv = vecAdd(vecMul(uv, 0.5), 0.5)
  return uv
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
  ctx.fillStyle = '#770'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for(let ix = 0; ix < canvas.width; ix += 1) {
    for (let jy = 0; jy < canvas.height; jy += 1) {
      ctx.beginPath()
      const uv = CRTCurveUV(vec2(ix / canvas.width, jy / canvas.height))
      if ( uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 )
      {
        continue
      }
      ctx.fillStyle = `rgba(${uv.x * 255}, ${uv.y * 255}, 0.0, 1.0)`
      ctx.arc(ix, jy, 3, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    }
  }
  // console.log(CRTCurveUV(vec2(0.5, 0.5)))
}

draw()
