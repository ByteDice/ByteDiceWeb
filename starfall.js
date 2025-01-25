const starfallCanvas = document.getElementById("starfallCanvas")
starfallCanvas.width = window.innerWidth
starfallCanvas.height = window.innerHeight

const starfallCtx = starfallCanvas.getContext("2d")


class Starfall {
  constructor() {
    this.pos = {x: 0, y: 0}
    this.vel = {x: 0, y: 0}
  }

  generate() {
    const dir = randomBool(0.5)
    this.pos.x = dir ? -50 : pxWidth + 50
    this.pos.y = randomInt(-starfallCanvas.height / 2, starfallCanvas.height / 2)
    this.vel.x = dir ? randomFloat(3, 6) : randomFloat(-6, -3)
    this.vel.y = randomFloat(0.25, 1)
  }

  draw() {
    // very expensive but idk how to make it less expensive
    drawPixelLine(
      this.pos.x,
      this.pos.y,
      this.pos.x - (this.vel.x * 5),
      this.pos.y - (this.vel.y * 5)
    )
  }

  stepAnimation() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }
}


function drawPixelLine(fromX, fromY, toX, toY) {
  const pxInflate = 0.1

  const dx = Math.abs(toX - fromX)
  const dy = Math.abs(toY - fromY)
  const sx = fromX < toX ? 1 : -1
  const sy = fromY < toY ? 1 : -1
  let err = dx - dy

  let x = fromX
  let y = fromY

  starfallCtx.beginPath()

  const steps = Math.max(dx, dy)

  for (let i = 0; i <= steps; i++) {
    const alpha = i == 0 ? 1 : 0.1 * (1 - i / steps)
    starfallCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`

    starfallCtx.rect(
      clampNearest(x * pxDensity, pxDensity) - 0.5,
      clampNearest(y * pxDensity, pxDensity) - 0.5,
      pxInflate + pxDensity,
      pxInflate + pxDensity
    )

    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x += sx
    }
    if (e2 < dx) {
      err += dx
      y += sy
    }

    starfallCtx.fill()
  }
}


let allStarfalls = []

function animateStarfalls() {
  if (!isAnimating) { return }

  starfallCtx.clearRect(0, 0, starfallCanvas.width, starfallCanvas.height)

  let shouldGenerate = randomBool(0.01)

  if (shouldGenerate) {
    let newStarfall = new Starfall()
    newStarfall.generate()
    allStarfalls.push(newStarfall)
  }

  for (let starfall of allStarfalls) {
    if (starfall.pos.x < -50 || starfall.pos.x > pxWidth + 50) {
      allStarfalls.splice(allStarfalls.indexOf(starfall), 1)
      continue
    }

    starfall.stepAnimation()
    starfall.draw()
  }
}


function startStarfall() {
  animateStarfalls()

  requestAnimationFrame(startStarfall)
}