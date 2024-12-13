function slideTransition(url) {
  const dur = 0.5
  const loadingTime = 1.0

  const slideLeft = `slide-left ${dur}s cubic-bezier(0, 0, 0, 1.46) forwards`

  let loadingScreen = document.getElementById("loadingScreen")
  let mainDiv = document.getElementById("mainDiv")

  loadingScreen.style.animation = slideLeft
  mainDiv.style.animation = slideLeft

  setLoadingProgress(`Loading URL "${url}"`)

  setTimeout(function() {
    setLoadingProgress("Done!")
    setTimeout(function() { document.location = url }, loadingTime * 1000)
  }, (dur + loadingTime) * 1000)
}