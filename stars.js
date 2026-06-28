const starfallCanvas = document.getElementById("starfallCanvas")
starfallCanvas.width = window.innerWidth
starfallCanvas.height = window.innerHeight

let lastUpd = Date.now()

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
    this.vel.x = dir ? randomFloat(240, 580) : randomFloat(-580, -240)
    this.vel.y = randomFloat(20, 80)
  }

  draw() {
		const LEN_X = this.vel.x / 15
		const LEN_Y = this.vel.y / 15

    // very expensive but idk how to make it less expensive (thanks canvas)
    drawPixelLine(
      this.pos.x,
      this.pos.y,
      this.pos.x - LEN_X,
      this.pos.y - LEN_Y
    )
  }

  stepAnimation(dt) {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
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
	let now = Date.now()

	const MILLISEC = 1000
	let dt = (now - lastUpd) / MILLISEC
	lastUpd = now

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

    starfall.stepAnimation(dt)
    starfall.draw()
  }
}


function startStarfall() {
  animateStarfalls()

  requestAnimationFrame(startStarfall)
}


function addStars() {
  let starNoise = document.getElementById("starNoise")
  let randX = randomInt(0, 256)
  let randY = randomInt(0, 256)

  debugPrint("Star pos", `[x: ${randX}, y: ${randY}]`)

  starNoise.style.top = `round(calc(${randX}px * var(--pxDensity)), var(--pxDensityPx))`
  starNoise.style.left = `round(calc(${randY}px * var(--pxDensity)), var(--pxDensityPx))`
}


function loadingScreenStars() {
	setLoadingProgress("Adding stars...")
  addStars()

  setLoadingProgress("Starting starfall animation...")
  startStarfall()
}