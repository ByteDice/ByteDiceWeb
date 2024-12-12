let canvas = document.getElementById("synthwave")
let ctx = canvas.getContext("2d")
let hills = []
let isAnimating = true

let pxInflate = 0.5

canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx.imageSmoothingEnabled = false;


function lerp(x, y, t) {
  return x + t * (y - x)
}


function hillCurve(x, width) {
  return (Math.sin(Math.PI * (x + 1)) + 1) ** width
}


function drawPixelLineLow(fromX, fromY, toX, toY) {
  let dx = toX - fromX
  let dy = toY - fromY
  let yi = 1

  if (dy < 0) {
    yi = -1
    dy = -dy
  }

  let d = 2 * dy - dx
  y = fromY

  for (let x = fromX; x <= toX; x++) {
    ctx.rect(
      clampNearest(x * pxDensity, pxDensity) - 0.5,
      clampNearest(y * pxDensity, pxDensity) - 0.5,
      pxInflate + pxDensity,
      pxInflate + pxDensity
    );

    if (d > 0) {
        y = y + yi;
        d = d + (2 * (dy - dx));
    }
    else { d = d + 2 * dy; }
  }
}


function drawPixelLineHigh(fromX, fromY, toX, toY) {
  let dx = toX - fromX
  let dy = toY - fromY
  let xi = 1

  if (dx < 0) {
    xi = -1
    dx = -dx
  }

  let d = 2 * dx - dy
  x = fromX

  for (let y = fromY; y <= toY; y++) {
    ctx.rect(
      clampNearest(x * pxDensity, pxDensity) - 0.5,
      clampNearest(y * pxDensity, pxDensity) - 0.5,
      pxInflate + pxDensity,
      pxInflate + pxDensity
    );

    if (d > 0) {
        x = x + xi;
        d = d + (2 * (dx - dy));
    }
    else { d = d + 2 * dx; }
  }
}


function drawPixelLine(fromX, fromY, toX, toY) {
  if (Math.abs(toY - fromY) < Math.abs(toX - fromX)) {
    if (fromX > toX) {
      drawPixelLineLow(toX, toY, fromX, fromY);
    } 
    else {
      drawPixelLineLow(fromX, fromY, toX, toY);
    }
  }
  else {
    if (fromY > toY) {
      drawPixelLineHigh(toX, toY, fromX, fromY);
    } 
    else {
      drawPixelLineHigh(fromX, fromY, toX, toY);
    }
  }
}


class Hill {
  constructor(x, y, color, width, frameCount) {
    this.color = color
    this.i = 0
    this.points = []
    this.x = x
    this.y = y
    this.frameCount = frameCount
    this.stepSize = 1
    this.width = width
    this.widthMul = 0.2
  }

  generate(iterCount, maxHeight, heightOffset, xRandom) {
    let offset = 0
    let stepSize = this.width / iterCount
  
    for (let i = 0; i < iterCount + 1; i++) {
      let offsetNorm = offset / this.width
      let randomHeight = randomInt(0, maxHeight * -hillCurve(offsetNorm, 1.2) * 10) + heightOffset
      let randomXOffset = undefined

      if (i == 0 || i == iterCount) { randomXOffset = 0 }
      else { randomXOffset = randomInt(-xRandom, xRandom) }

      this.points.push([offset + randomXOffset, randomHeight])
  
      offset += stepSize
    }
  }


  draw(debug) {
    ctx.lineWidth = pxDensity

    let startX = ((this.points[0][0] * this.widthMul) + ((-this.width * this.widthMul) / 2) + this.x) / pxDensity
    let startY = ((this.points[0][1] * this.widthMul) + this.y) / pxDensity

    let previousX = startX
    let previousY = startY
  
    ctx.beginPath()
    if (debug) { ctx.moveTo(startX * pxDensity, startY * pxDensity) }
  
    for (let point of this.points) {
      let x = ((point[0] * this.widthMul) + ((-this.width * this.widthMul) / 2) + this.x) / pxDensity
      let y = ((point[1] * this.widthMul) + this.y) / pxDensity

      if (debug) { ctx.lineTo(x * pxDensity, y * pxDensity) }
      else { drawPixelLine(previousX, previousY, x, y) }

      previousX = x
      previousY = y
    }
    if (debug) {
      ctx.strokeStyle = "#ff0000"
      ctx.stroke()
    }
    else {
      ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`
      ctx.fill()
    }
  }


  animateStep(stepSize, colorIncrement, debug) {
    if (this.i >= this.frameCount) { 
      hills.pop(this)
      return
    }

    this.y += stepSize
    this.draw(debug)

    this.i += 1

    this.color[0] += colorIncrement
    this.color[1] += colorIncrement
    this.color[2] += colorIncrement
  }
}


function connectHills(hill, previousHill, idx, debug) {
  let pHill = previousHill

  if (pHill && idx != 0) {
    for (idx in pHill.points) {
      let startX = ((pHill.points[idx][0] * pHill.widthMul) + ((-pHill.width * pHill.widthMul) / 2) + pHill.x) / pxDensity
      let startY = ((pHill.points[idx][1] * pHill.widthMul) + pHill.y) / pxDensity

      let endX = ((hill.points[idx][0] * hill.widthMul) + ((-hill.width * hill.widthMul) / 2) + hill.x) / pxDensity
      let endY = ((hill.points[idx][1] * hill.widthMul) + hill.y) / pxDensity

      let grad = ctx.createLinearGradient(startX, startY, endX, endY)
      let col = hill.color
      let pCol = pHill.color
      
      grad.addColorStop(0, `rgb(${pCol[0]}, ${pCol[1]}, ${pCol[2]})`)
      grad.addColorStop(1, `rgb(${col[0]}, ${col[1]}, ${col[2]})`)

      ctx.beginPath()

      if (debug) {
        ctx.strokeStyle = grad

        ctx.moveTo(startX * pxDensity, startY * pxDensity)
        ctx.lineTo(endX * pxDensity, endY * pxDensity)
        ctx.stroke()
      }
      else {
        ctx.fillStyle = grad

        drawPixelLine(startX, startY, endX, endY)
        ctx.fill()
      }
    }
  }
}


const iterToNewHill = 25
let iters = 0
let previousHill = undefined

function animateSynthWave() {
  if (!isAnimating) { return }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (iters >= iterToNewHill) {
    let hillInstance = new Hill(canvas.width / 2, canvas.height / 3 * 2, [0, 180, 240], canvas.width, 325)
    hillInstance.generate(25, canvas.height / 24, 100, 15)
    hills.unshift(hillInstance)
    iters = 0
  }


  for (let idx in hills) {
    let hill = hills[idx]
    //hill.animateStep(hill.stepSize, -0.2, true)
    hill.animateStep(hill.stepSize, -0.2, false)
    hill.stepSize = -0.005
    hill.widthMul *= 1.01

    connectHills(hill, previousHill, idx, false)

    previousHill = hill
  }

  iters++
}


function startSynthAnimation() {
  for (i = 0; i < 350; i++) {
    animateSynthWave()
  }

  setInterval( animateSynthWave, 1000 / 24)
}