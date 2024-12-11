document.addEventListener("DOMContentLoaded", function() {
  let starNoise = document.getElementById("starNoise")
  let randX = randomInt(0, 256)
  let randY = randomInt(0, 256)

  starNoise.style.top = `calc(${randX}px * var(--pxDensity))`
  starNoise.style.left = `calc(${randY}px * var(--pxDensity))`
}, false)