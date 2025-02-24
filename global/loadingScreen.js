let isLoading = true
let stopLoading = false
let loadingScreenEl = document.getElementById("loadingScreen")
let loadingComplete = false
let fakeLoadingComplete = false


loadingScreenEl.className = "bgDiv"
loadingScreenEl.innerHTML = `
  <img class="loadingImg" draggable="false" src="/assets/byteDiceBlinkAnim_32x32.png">

  <button class="pxFont" onclick="stopShowingLoading()" id="loadingCornerText">
    Press ESC to instantly close the loading screen<br>Or click me to never see it again.
  </button>

  <p id="loadingText">Loading...<br>Loading files...<br><br>Tip: Tip loading...</p>
`


let loadingScreenProgress = document.getElementById("loadingText")

let tipsJson


async function loadTips() {
  let tipsText = await fetch("/data/loadingScreenTips.json").then(response => response.text())
  tipsJson = JSON.parse(tipsText)
  console.log(tipsJson)
}


const fakeLoading = localStorage["fakeLoading"] || "true"
let selectedTip = "undefined"


function newTip() {
  if (randomIntFrom0(1000) == 0) {
    // If you snitch this easter egg code
    // then I'll close the source and
    // permanently remove the easter egg. 
    selectedTip = `You like kissing boys, don't you?<br>
      <img src="/assets/boykissers/boykisser_64x64.png"
      style="aspect-ratio: 1 / 1; width: min-content; height: min-content;">`
  }
  else {
    selectedTip = tipsJson[randomIntFrom0(tipsJson.length)]
  }

  debugPrint("new tip", selectedTip)
} 


function setLoadingProgress(newText) {
  loadingScreenProgress.innerHTML = `Loading...<br>${newText}<br><br>Tip: ${selectedTip}`
}

function startLoadingScreen() {
	loadingScreenProgress.innerHTML = `Loading...<br><br>Tip: ${selectedTip}`

  if (fakeLoading != "true") {
    let cText = document.getElementById("loadingCornerText")
    if (cText) { cText.remove() }
  }

	const loadDur = randomFloat(2000, 4000)
  debugPrint("loadDur initial", loadDur)

	setTimeout(function() {
    if (loadingComplete) { removeLoadingScreen() }
    fakeLoadingComplete = true
  }, loadDur)
}


function removeLoadingScreen(rmCornerText = false) {
  if (!isLoading) { return }

  setLoadingProgress("Done!")

  isLoading = false
	const fadeOutDur = 0.5
	
	setTimeout(function() {
    loadingScreenEl.style.animation = `fade-out ${fadeOutDur}s forwards`

    setTimeout(function() {
      loadingScreenEl.style.left = "100vw"
      if (rmCornerText) {
        let cText = document.getElementById("loadingCornerText")
        if (cText) { cText.remove() }
      }
      newTip()
    }, fadeOutDur * 1000)
  }, 500)
}


function stopShowingLoading() {
	localStorage["fakeLoading"] = false
}


document.addEventListener("keydown", function(event) {
	if (event.key === "Escape") {
		removeLoadingScreen()
	}
})
