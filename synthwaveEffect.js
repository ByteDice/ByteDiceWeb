// TODO: dont render lines behind the fill (fillHillPolygons())

let canvas = document.getElementById("synthwave")
let ctx = canvas.getContext("2d")
let hills = []

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


function idxWidthOffset(hill, idx) {
  let x = ((hill.points[idx][0] * hill.widthMul) + ((-hill.width * hill.widthMul) / 2) + hill.x) / pxDensity
  let y = ((hill.points[idx][1] * hill.widthMul) + hill.y) / pxDensity

  return { x: x, y: y }
}


function idxWidthOffsetNoPx(hill, idx) {
  let x = ((hill.points[idx][0] * hill.widthMul) + ((-hill.width * hill.widthMul) / 2) + hill.x)
  let y = ((hill.points[idx][1] * hill.widthMul) + hill.y)

  return { x: x, y: y }
}


function xyWidthOffset(hill, x, y) {
  let x1 = ((x * hill.widthMul) + ((-hill.width * hill.widthMul) / 2) + hill.x) / pxDensity
  let y1 = ((y * hill.widthMul) + hill.y) / pxDensity

  return { x: x1, y: y1 }
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

    let start = xyWidthOffset(this, this.points[0][0], this.points[0][1])

    let previousX = start.x
    let previousY = start.y
  
    ctx.beginPath()
    if (debug) { ctx.moveTo(start.x * pxDensity, start.y * pxDensity) }
  
    for (let point of this.points) {
      let pos = xyWidthOffset(this, point[0], point[1])

      if (debug) { ctx.lineTo(pos.x * pxDensity, pos.y * pxDensity) }
      else { drawPixelLine(previousX, previousY, pos.x, pos.y) }

      previousX = pos.x
      previousY = pos.y
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


function connectHills(hill, previousHill, hillIdx, debug) {
  let pHill = previousHill

  if (pHill && hillIdx != 0) {
    for (let idx in pHill.points) {
      let start = idxWidthOffset(pHill, idx)
      let end = idxWidthOffset(hill, idx)

      let grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
      let col = hill.color
      let pCol = pHill.color
      
      grad.addColorStop(0, `rgb(${pCol[0]}, ${pCol[1]}, ${pCol[2]})`)
      grad.addColorStop(1, `rgb(${col[0]}, ${col[1]}, ${col[2]})`)

      ctx.beginPath()

      if (debug) {
        ctx.strokeStyle = grad

        ctx.moveTo(start.x * pxDensity, start.y * pxDensity)
        ctx.lineTo(end.x * pxDensity, end.y * pxDensity)
        ctx.stroke()
      }
      else {
        ctx.fillStyle = grad

        drawPixelLine(start.x, start.y, end.x, end.y)
        ctx.fill()
      }
    }
  }
}


function fillHillPolygons(hill, previousHill, hillIdx) {
  let pHill = previousHill

  if (pHill && hillIdx != 0) {
    for (let idx in pHill.points) {
      if (idx == 0) { continue }

      let br = idxWidthOffsetNoPx(pHill, idx)
      let bl = idxWidthOffsetNoPx(pHill, idx - 1)
      let tr = idxWidthOffsetNoPx(hill, idx)
      let tl = idxWidthOffsetNoPx(hill, idx - 1)

      ctx.beginPath()
      ctx.fillStyle = "#323232"

      ctx.moveTo(clampNearest(tl.x, pxDensity), clampNearest(tl.y, pxDensity))
      ctx.lineTo(clampNearest(tr.x, pxDensity), clampNearest(tr.y, pxDensity))
      ctx.lineTo(clampNearest(br.x, pxDensity), clampNearest(br.y, pxDensity))
      ctx.lineTo(clampNearest(bl.x, pxDensity), clampNearest(bl.y, pxDensity))
      ctx.lineTo(clampNearest(tl.x, pxDensity), clampNearest(tl.y, pxDensity))

      ctx.fill()
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
    let hillInstance = new Hill(canvas.width / 2 - (1 * pxDensity), canvas.height / 3 * 2, [0, 180, 240], canvas.width, 350)
    hillInstance.generate(25, canvas.height / 24, 100, 2 * pxDensity)
    hills.unshift(hillInstance)
    iters = 0
  }

  let prevHillPolygons = undefined

  for (let idx in hills) {
    let hill = hills[idx]
    hill.y += hill.stepSize
    hill.widthMul *= 1.01

    fillHillPolygons(hill, prevHillPolygons, idx)

    prevHillPolygons = hill
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

  setInterval( animateSynthWave, 1000 / 12)
}