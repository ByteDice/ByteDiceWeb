let pxDensity = parseFloat(getComputedStyle(document.body).getPropertyValue("--pxDensity"))
let pxDensityDefined = false

function calcPixelDensity() {
  let densityWidth =  document.documentElement.clientWidth / 256
  let densityHeight = document.documentElement.clientHeight / 164


  document.documentElement.style.setProperty("--pxDensity", Math.max(densityWidth, densityHeight))
  document.documentElement.style.setProperty("--pxDensityPx", `${Math.max(densityWidth, densityHeight)}px`)

  pxDensity = parseFloat(getComputedStyle(document.body).getPropertyValue("--pxDensity"))

  console.log("pxDensity: " + getComputedStyle(document.body).getPropertyValue("--pxDensity"))
  pxDensityDefined = true
}