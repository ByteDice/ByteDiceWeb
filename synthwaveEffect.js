let canvas = document.getElementById("synthwave")
let ctx = canvas.getContext("2d")
let hills = []
let isAnimating = true

canvas.width = window.innerWidth
canvas.height = window.innerHeight


function lerp(x, y, t) {
  return x + t * (y - x)
}


function hillCurve(x, width) {
  return (Math.sin(Math.PI * (x + 1)) + 1) ** width
}


class Hill {
  constructor(x, y, color, xRandom, width, frameCount) {
    this.color = color
    this.i = 0
    this.points = []
    this.x = x
    this.y = y
    this.xRandom = xRandom
    this.frameCount = frameCount
    this.stepSize = 1
    this.width = width
    this.widthMul = 0.2
  }

  generate(iterCount, maxHeight, heightOffset) {
    let offset = 0
    let stepSize = this.width / iterCount
  
    for (let i = 0; i < iterCount + 1; i++) {
      let offsetNorm = offset / this.width
      let randomHeight = randomInt(0, maxHeight * -hillCurve(offsetNorm, 1.2) * 10) + heightOffset
      let randomXOffset = undefined

      if (i == 0 || i == iterCount) { randomXOffset = 0 }
      else { randomXOffset = randomInt(-this.xRandom, this.xRandom) }

      this.points.push([offset + randomXOffset, randomHeight])
  
      offset += stepSize
    }
  }


  draw() {
    ctx.strokeStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`
    ctx.lineWidth = pxDensity

    let startX = (this.points[0][0] * this.widthMul) + ((-this.width * this.widthMul) / 2) + this.x
    let startY = (this.points[0][1] * this.widthMul) + this.y
  
    ctx.beginPath()
    ctx.moveTo(startX, startY)
  
    for (let point of this.points) {
      ctx.lineTo(
      (point[0] * this.widthMul) + ((-this.width * this.widthMul) / 2) + this.x,
      (point[1] * this.widthMul) + this.y
      )
    }
    ctx.stroke()
  }


  animateStep(stepSize, colorIncrement) {
    if (this.i >= this.frameCount) { 
      hills.pop(this)
      return
    }

    this.y += stepSize
    this.draw()

    this.i += 1

    this.color[0] += colorIncrement
    this.color[1] += colorIncrement
    this.color[2] += colorIncrement
  }
}


const iterToNewHill = 15
let iters = 0
let previousHill = undefined

function animateSynthWave() {
  if (!isAnimating) { return }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (iters >= iterToNewHill) {
    let hillInstance = new Hill(canvas.width / 2, canvas.height / 3 * 2, [0, 180, 240], 25, canvas.width, 325)
    hillInstance.generate(25, canvas.height / 24, 100)
    hills.unshift(hillInstance)
    iters = 0
  }


  for (let idx in hills) {
    let hill = hills[idx]
    hill.animateStep(hill.stepSize, -0.2)
    hill.stepSize = -0.005
    hill.widthMul *= 1.01


    if (previousHill && idx != 0) {
      for (idx in previousHill.points) {
        let startX = (previousHill.points[idx][0] * previousHill.widthMul) + ((-previousHill.width * previousHill.widthMul) / 2) + previousHill.x
        let startY = (previousHill.points[idx][1] * previousHill.widthMul) + previousHill.y
        let endX = (hill.points[idx][0] * hill.widthMul) + ((-hill.width * hill.widthMul) / 2) + hill.x
        let endY = (hill.points[idx][1] * hill.widthMul) + hill.y

        let grad = ctx.createLinearGradient(startX, startY, endX, endY)
        let col = hill.color
        let pCol = previousHill.color
        
        grad.addColorStop(0, `rgb(${pCol[0]}, ${pCol[1]}, ${pCol[2]})`)
        grad.addColorStop(1, `rgb(${col[0]}, ${col[1]}, ${col[2]})`)

        ctx.strokeStyle = grad
        ctx.lineWidth = pxDensity

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    }

    previousHill = hill
  }

  iters++
}


document.addEventListener("DOMContentLoaded", function() {
  for (i = 0; i < 350; i++) {
    animateSynthWave()
  }

  setInterval( animateSynthWave, 1000 / 24)
}, false)