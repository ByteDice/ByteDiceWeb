const PAGES = {
  null: -1,
  SYNTHWAVE: 0,
}

let CURRENT_PAGE = PAGES.null

let isAnimating = true
let gridVisible = false

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


function lerp(x, y, t) {
  return x + t * (y - x)
}


function toggleGrid() {
  if (gridVisible) {
    document.getElementById("gridCanvas").remove()
    gridVisible = false
    return
  }

  let canvasEl = document.createElement("canvas")
  canvasEl.id = "gridCanvas"
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

  gridVisible = true
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


document.addEventListener("DOMContentLoaded", async function() {
  startLoadingScreen()

  setLoadingProgress("Fetching tips...")

  await loadTips()

  newTip()

  setLoadingProgress("Calculating pixel density...")
  calcPixelDensity()
  console.log("pxDensity: " + getComputedStyle(document.body).getPropertyValue("--pxDensity"))

  switch (CURRENT_PAGE) {
    case (PAGES.SYNTHWAVE): loadingScreenSynthwave()
  }
  
  pauseAnimBtn(localStorage["isAnimating"] || "true")

  if (showLoading != "true") { 
    removeLoadingScreen()
  }
  else {
    setLoadingProgress("Cleaning up...")
  }
}, false)


window.addEventListener("resize", () => {
  calcPixelDensity()

  switch (CURRENT_PAGE) {
    case (PAGES.SYNTHWAVE): onResizeSynthwave()
  }

  if (gridVisible) {
    toggleGrid()
    toggleGrid()
  }
})

let prevAnimationState = isAnimating

document.addEventListener("visibilitychange", function (event) {
  if (document.hidden) {
    prevAnimationState = isAnimating
    isAnimating = false
  }
  else {
    isAnimating = prevAnimationState
  }
});