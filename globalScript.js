function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}


function randomIntFrom0(max) {
  return Math.floor(Math.random() * max)
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}


function showGrid() {
  let canvasEl = document.createElement("canvas")
  canvasEl.width = window.innerWidth
  canvasEl.height = window.innerHeight
  canvasEl.style.position = "absolute"
  canvasEl.style.top = "0%"
  canvasEl.style.left = "0%"
  canvasEl.style.pointerEvents = "none"

  let ctx = canvasEl.getContext("2d")

  document.body.appendChild(canvasEl)

  let repeatCountX = window.innerWidth / pxDensity
  let repeatCountY = window.innerHeight / pxDensity

  ctx.strokeStyle = "#ff0000"
  ctx.beginPath()

  for (x = 0; x < repeatCountX; x++) {
    ctx.moveTo(x * pxDensity, 0)
    ctx.lineTo(x * pxDensity, window.innerHeight)
  }

  for (y = 0; y < repeatCountY; y++) {
    ctx.moveTo(0, y * pxDensity)
    ctx.lineTo(window.innerWidth, y * pxDensity)
  }

  ctx.stroke()
}