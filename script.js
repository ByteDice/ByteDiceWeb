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


function onResizeSynthwave() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  if (shaderMaterial) { updateShaderMatPxDensity() }
}