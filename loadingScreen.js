function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}


function randomIntFrom0(max) {
	return Math.floor(Math.random() * max)
}


document.addEventListener("DOMContentLoaded", function() {
	if (showLoading != "true") { return }

	document.body.appendChild(loadingScreenEl)

	const loadDur = randomFloat(3, 6) * 1000

	setTimeout(function() {
		removeLoadingScreen()
	}, loadDur)
}, false)


function removeLoadingScreen() {	
	const fadeOutDur = 0.5
	
	loadingScreenEl.style.animation = `fade-out ${fadeOutDur}s forwards`

	setTimeout(function() {
		document.body.removeChild(loadingScreenEl)
	}, fadeOutDur * 1000);
}


function stopShowingLoading() {
	localStorage["showLoading"] = false
}


document.addEventListener("keydown", function(event) {
	if (event.key === "Escape") {
		removeLoadingScreen()
	}
})


let loadingScreenEl = document.createElement("div")
loadingScreenEl.className = "bgDiv"

let loadingImg = `<img class="loadingImg" draggable="false" src="/assets/byteDiceBlinkAnim_32x32.png">`
let closeText = `
	<button class="loadingCornerText pxFont" onclick="stopShowingLoading()">
		Press ESC to instantly close theloading screen<br>Click me to never see it again.
	</button>
`

let tips = [
	"Just don't die.",
	"This is a tip.",
	"Is thisn't not very un-understandable?"
]

let loadingText = `<p class="loadingText">Loading...<br>Tip: ${tips[randomIntFrom0(tips.length)]}</p>`

loadingScreenEl.innerHTML = loadingImg + closeText + loadingText


const showLoading = localStorage["showLoading"] || true