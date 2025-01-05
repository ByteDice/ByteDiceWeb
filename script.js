document.addEventListener("DOMContentLoaded", function() {
  startLoadingScreen()

  setLoadingProgress("Calculating pixel density...")
  calcPixelDensity()
  
  setLoadingProgress("Adding stars...")
  addStars()
  
  pauseAnimBtn(localStorage["isAnimating"] || "true")

  if (showLoading != "true") { 
    removeLoadingScreen()
  }
  else {
    setLoadingProgress("Cleaning up...")
  }
}, false)


function addStars() {
  let starNoise = document.getElementById("starNoise")
  let randX = randomInt(0, 256)
  let randY = randomInt(0, 256)

  starNoise.style.top = `round(calc(${randX}px * var(--pxDensity)), var(--pxDensityPx))`
  starNoise.style.left = `round(calc(${randY}px * var(--pxDensity)), var(--pxDensityPx))`
}