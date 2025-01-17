function slideTransition(url) {
  const dur = 500
  const loadingTime = randomFloat(500, 1500)
  debugPrint("loadDur transition", loadingTime)

  const slideLeft = `slide-left ${dur / 1000}s cubic-bezier(0, 0, 0, 1.46) forwards`

  let loadingScreen = document.getElementById("loadingScreen")
  let mainDiv = document.getElementById("mainDiv")

  loadingScreen.style.animation = slideLeft
  loadingScreen.style.pointerEvents = "auto"
  mainDiv.style.animation = slideLeft

  setLoadingProgress(`Loading URL "${url}"`)

  setTimeout(function() {
    setLoadingProgress("Done!")
    setTimeout(function() { document.location = url }, loadingTime)
  }, dur + loadingTime)
}