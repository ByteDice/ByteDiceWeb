let isLoading = true
let stopLoading = false
let loadingScreenProgress = document.getElementById("loadingText")
let loadingScreenEl = document.getElementById("loadingScreen")

let tips = [
	"Just don't die.",
	"Did you know this is a tip?",
	"Is thisn't not very un-understandable?",
  "m".repeat(200),
  "Bad at a game? Just press the \"get good at games\" button!",
  "I AM NOT A FEMBOY NOR GAY. (I support though :thumbsup:)",
  "You should listen to that song that goes \"do do do do do do do do do.\""
]

let selectedTip = tips[randomIntFrom0(tips.length)]
const showLoading = localStorage["showLoading"] || "true"


function setLoadingProgress(newText) {
  loadingScreenProgress.innerHTML = `Loading...<br>${newText}<br><br>Tip: ${selectedTip}`
}


function startLoadingScreen() {
	loadingScreenProgress.innerHTML = `Loading...<br><br>Tip: ${selectedTip}`

	const loadDur = randomFloat(3000, 6000)

	setTimeout(removeLoadingScreen, loadDur)
}


function removeLoadingScreen() {
  if (!isLoading) { return }

  setLoadingProgress("Done!")

  isLoading = false
	const fadeOutDur = 0.5
	
	setTimeout(function() {
    loadingScreenEl.style.animation = `fade-out ${fadeOutDur}s forwards`

    setTimeout(function() {
      document.body.removeChild(loadingScreenEl)
    }, fadeOutDur * 1000)
  }, 500)
}


function stopShowingLoading() {
	localStorage["showLoading"] = false
}


document.addEventListener("keydown", function(event) {
	if (event.key === "Escape") {
		removeLoadingScreen()
	}
})
