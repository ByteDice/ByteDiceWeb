let isLoading = true
let stopLoading = false
let loadingScreenProgress = document.getElementById("loadingText")
let loadingScreenEl = document.getElementById("loadingScreen")


let tipsJson;

(function loadTipsSync() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "./loadingScreenTips.json", false)
  xhr.send(null)

  if (xhr.status === 200) {
    tipsJson = JSON.parse(xhr.responseText)
  } else {
    console.error("Failed to load tips:", xhr.status, xhr.statusText)
    tipsJson = []
  }
})()

console.log(tipsJson)

let selectedTip = tipsJson[randomIntFrom0(tipsJson.length)]
const showLoading = localStorage["showLoading"] || "true"


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
