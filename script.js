CURRENT_PAGE = PAGES.SYNTHWAVE

function loadingScreenSynthwave() {
  setLoadingProgress("Adding stars...")
  addStars()

  setLoadingProgress("Starting synthwave animation...")
  preAnimateSynthwave(25)
  animateSynthwave(0)
}


function addStars() {
  let starNoise = document.getElementById("starNoise")
  let randX = randomInt(0, 256)
  let randY = randomInt(0, 256)

  debugPrint("Star pos", `[x: ${randX}, y: ${randY}]`)

  starNoise.style.top = `round(calc(${randX}px * var(--pxDensity)), var(--pxDensityPx))`
  starNoise.style.left = `round(calc(${randY}px * var(--pxDensity)), var(--pxDensityPx))`
}