let pxDensity = 1
let pxDensityDefined = false

let pxWidth = 256
let pxHeight = 164

let densityWidth = document.documentElement.clientWidth / pxWidth
let densityHeight = document.documentElement.clientHeight / pxHeight

function calcPixelDensity() {
  densityWidth = document.documentElement.clientWidth / pxWidth
  densityHeight = document.documentElement.clientHeight / pxHeight

  let widest = Math.max(densityWidth, densityHeight)

  document.documentElement.style.setProperty("--pxDensity", widest)
  document.documentElement.style.setProperty("--pxDensityPx", `${widest}px`)

  pxDensity = widest

  pxDensityDefined = true
}