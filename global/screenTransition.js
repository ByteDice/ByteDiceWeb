let loadingScreen = document.getElementById("loadingScreen")
let mainDiv = document.getElementById("mainDiv")

function slideTransition(url, event) {
  const ctrlPressed = event.ctrlKey
  const dur = 500
  const loadingTime = randomFloat(500, 1500)
  debugPrint("loadDur transition", loadingTime)

  const slideLeft = `slide-left ${dur / 1000}s cubic-bezier(0, 0, 0, 1.46) forwards`

  loadingScreen.style.animation = slideLeft
  loadingScreen.style.pointerEvents = "auto"
  mainDiv.style.animation = slideLeft

  setLoadingProgress(`Loading URL "${url}"`)

  setTimeout(function() {
    setLoadingProgress("Done!")
    setTimeout(function() {
      if (ctrlPressed) {
        window.open(url, "_blank")
      }
      else if (url.startsWith("http")) {
        window.open(url, "_blank").focus()
      }
      else {
        document.location = url
      }

      resetLoadingScreen()
    }, loadingTime)
  }, dur + loadingTime)
}

function resetLoadingScreen() {
  const fadeOutDur = 0.5

  loadingScreen.style.left = "0vw"
  loadingScreen.style.animation = `fade-out ${fadeOutDur}s forwards`
  mainDiv.style.animation = "none"

  setTimeout(function() {
    loadingScreen.style.left = "100vw"
  }, fadeOutDur * 1000)
}