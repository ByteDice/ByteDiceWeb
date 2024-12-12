let pxDensity = getComputedStyle(document.body).getPropertyValue("--pxDensity")
let pxDensityDefined = false

document.addEventListener("DOMContentLoaded", function() {
  let densityWidth =  document.documentElement.clientWidth / 256
  let densityHeight = document.documentElement.clientHeight / 164


  document.documentElement.style.setProperty("--pxDensity", Math.max(densityWidth, densityHeight))
  document.documentElement.style.setProperty("--pxDensityPx", `${Math.max(densityWidth, densityHeight)}px`)
  pxDensity = getComputedStyle(document.body).getPropertyValue("--pxDensity")
  pxDensityDefined = true

  console.log("pxDensity: " + getComputedStyle(document.body).getPropertyValue("--pxDensity"))
}, false)