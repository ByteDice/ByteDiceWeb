let isLoading = true
let stopLoading = false
let loadingScreenEl = document.getElementById("loadingScreen")
let loadingComplete = false
let fakeLoadingComplete = false


loadingScreenEl.className = "bgDiv"
loadingScreenEl.innerHTML = `
  <img class="loadingImg" draggable="false" src="/assets/byteDiceBlinkAnim_32x32.png" id="loadingImg">

  <div style="margin-left: calc(3px * var(--pxDensity)); display: flex;" id="fakeLoadingToggle">
    <p class="encased" style="height: 100%">
      Use extended loading screen?<br>
      <small style="margin: 0px; font-size: 10px;">(For immersion)</small>
    </p>
    <div class="encased" style="height: inherit; display: flex;">
      <label class="switch" style="margin: auto;">
        <input type="checkbox" name="fakeLoadingToggle" onclick="setShowLoading(this.checked)" ${localStorage["fakeLoading"] != "true" ? "" : "checked"}>
        <span class="switchDecor"></span>
      </label>
    </div>
  </div>

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

	const loadDur = randomFloat(2000, 4000)
  debugPrint("loadDur initial", loadDur)

	setTimeout(function() {
    if (loadingComplete) { removeLoadingScreen() }
    fakeLoadingComplete = true
  }, loadDur)
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
      newTip()
    }, fadeOutDur * 1000)
  }, 500)
}


function setShowLoading(state) {
	localStorage["fakeLoading"] = state
}


document.addEventListener("keydown", function(event) {
	if (event.key === "Escape") {
		removeLoadingScreen()
	}
})
