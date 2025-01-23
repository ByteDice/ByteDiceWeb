const PAGES = {
  null: -1,
  SYNTHWAVE: 0,
  TOYS: 1,
  LICENSE: 2,
}
const CONSOLE_COLORS = {
  red: "color: #FF0000;",
  green: "color: #00FF00",
  white: "color: #FFFFFF;",
  debugTitle: "color: #00FF00;",
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


function debugPrint(title, value) {
  if (!title) {
    console.error(
`error[A0000]: this function takes 1 argument but 0 arguments were supplied
 --> unknown:0:0
  |
0 | debugPrint()
  | ^^^^^^^^^^-- argument #1 of type \`Any\` is missing`
)
    return;
  }

  if (value) {
    console.log(`%c${title}:\n%c${value}`, CONSOLE_COLORS.debugTitle, CONSOLE_COLORS.white)
  }
  else {
    console.log(`%c${title}`, CONSOLE_COLORS.debugTitle)
  }
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
    pauseBtn.src = "/assets/icons/pauseAnimation_8x8.png"
  }
  else {
    isAnimating = false
    pauseBtn.src = "/assets/icons/playAnimation_8x8.png"
  }

  localStorage["isAnimating"] = isAnimating
}


document.addEventListener("DOMContentLoaded", async function() {
  debugPrint("currentPage", `${CURRENT_PAGE} ${Object.keys(PAGES)[CURRENT_PAGE + 1]}`)

  startLoadingScreen()

  setLoadingProgress("Fetching tips...")

  await loadTips()

  newTip()

  setLoadingProgress("Calculating pixel density...")
  calcPixelDensity()

  if (densityWidth > densityHeight) { debugPrint("pxDensity", `Width, ${pxDensity}`) }
  else { debugPrint("pxDensity", `Height, ${pxDensity}`) } 

  setLoadingProgress("adding navBar...")
  await loadNavBarJson()
  onLoadNavBar()

  switch (CURRENT_PAGE) {
    case (PAGES.SYNTHWAVE): loadingScreenSynthwave(); break
    case (PAGES.LICENSE):   onLoadLicense(); break
  }
  
  pauseAnimBtn(localStorage["isAnimating"] || "true")
  debugPrint("isAnimating", isAnimating)

  if (showLoading != "true") { 
    removeLoadingScreen(true)
  }
  else {
    setLoadingProgress("Cleaning up...")
    loadingComplete = true
    if (fakeLoadingComplete) {
      removeLoadingScreen()
    }
  }
}, false)


window.addEventListener("resize", function() {
  calcPixelDensity()

  switch (CURRENT_PAGE) {
    case (PAGES.SYNTHWAVE): onResizeSynthwave()
  }

  // unoptimal but works well enough
  if (gridVisible) {
    toggleGrid()
    toggleGrid()
  }
})


window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // reload page to clear unwanted cache.
    // for some reason the loading screen stays
    // permanently open without this.
    window.location.reload();
  }
});

let prevAnimationState = isAnimating

/*
document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    prevAnimationState = isAnimating;
    isAnimating = false;
  }
  else {
    isAnimating = prevAnimationState;
  }
});


window.addEventListener("blur", function() {
  if (document.visibilityState === "visible") {
    prevAnimationState = isAnimating;
    isAnimating = false;
  }
});


window.addEventListener("focus", function() {
  if (!document.hidden) {
    isAnimating = prevAnimationState;
  }
});
*/