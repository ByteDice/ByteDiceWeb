let pxDensity = parseFloat(getComputedStyle(document.body).getPropertyValue("--pxDensity"))
let pxDensityDefined = false

let densityWidth = document.documentElement.clientWidth / 256
let densityHeight = document.documentElement.clientHeight / 164

function calcPixelDensity() {
  densityWidth = document.documentElement.clientWidth / 256
  densityHeight = document.documentElement.clientHeight / 164

  let widest = Math.max(densityWidth, densityHeight)

  document.documentElement.style.setProperty("--pxDensity", widest)
  document.documentElement.style.setProperty("--pxDensityPx", `${widest}px`)

  pxDensity = parseFloat(getComputedStyle(document.body).getPropertyValue("--pxDensity"))

  pxDensityDefined = true
}