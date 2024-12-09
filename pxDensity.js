document.addEventListener('DOMContentLoaded', function() {
  let densityWidth =  document.documentElement.clientWidth / 256
  let densityHeight = document.documentElement.clientHeight / 164


  document.documentElement.style.setProperty("--pxDensity", Math.max(densityWidth, densityHeight))
  console.log(getComputedStyle(document.body).getPropertyValue("--pxDensity"))
}, false)