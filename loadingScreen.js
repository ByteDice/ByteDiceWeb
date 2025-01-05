let isLoading = true
let stopLoading = false
let loadingScreenProgress = document.getElementById("loadingText")
let loadingScreenEl = document.getElementById("loadingScreen")


let tipsJson


async function loadTips() {
  let tipsText = await fetch("./loadingScreenTips.json").then(response => response.text())
  tipsJson = JSON.parse(tipsText)
}


const showLoading = localStorage["showLoading"] || "true"
let selectedTip = "undefined"


function newTip() {
  selectedTip = tipsJson[randomIntFrom0(tipsJson.length)]
} 


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
      loadingScreenEl.style.left = "100vw"
      loadingScreenEl.style.pointerEvents = "none"
      document.getElementById("loadingCornerText").remove()
      newTip()
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
