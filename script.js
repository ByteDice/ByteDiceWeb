CURRENT_PAGE = PAGES.SYNTHWAVE

function loadingScreenSynthwave() {
  setLoadingProgress("Adding stars...")
  addStars()

  setLoadingProgress("Starting starfall animation...")
  startStarfall()

  setLoadingProgress("Starting synthwave animation...")
  defShaderMaterial()
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


function onResizeSynthwave() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  if (shaderMaterial) { updateShaderMatPxDensity() }
}