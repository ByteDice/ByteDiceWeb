let isAnimating = true

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}


function randomIntFrom0(max) {
  return Math.floor(Math.random() * max)
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}


function clampNearest(n, mul) {
  if(n > 0)
    return Math.ceil(n / mul) * mul;
  else if( n < 0)
      return Math.floor(n / mul) * mul;
  else
      return 0;
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


function pauseAnimBtn(state) {
  if (state == "auto") {
    if (localStorage["isAnimating"] == "true") { localStorage["isAnimating"] = "false" }
    else { localStorage["isAnimating"] = "true" }

    state = localStorage["isAnimating"]
  }

  let pauseBtn = document.getElementById("animationToggle")

  if (state == "true") {
    isAnimating = true
    pauseBtn.src = "./assets/pauseAnimation_8x8.png"
  }
  else {
    isAnimating = false
    pauseBtn.src = "./assets/playAnimation_8x8.png"
  }

  localStorage["isAnimating"] = state
}