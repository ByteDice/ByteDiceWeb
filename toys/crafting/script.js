CURRENT_PAGE = PAGES.CRAFTING

let tomlInputContainer = document.getElementById("tomlInputContainer")
let collapseButton = document.getElementById("collapseButton")
let treeStatic = document.getElementById("treeStaticContainer")
let treeScale = document.getElementById("treeScaleContainer")


let mouseX = 0
let mouseY = 0
let dragX = 0
let dragY = 0
let dragOffsetX = 0
let dragOffsetY = 0
let isDragging = false
let scale = 1


let isCollapsed = false


document.addEventListener("mousemove", function(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
})


function collapseInput() {
	const COLLAPSE = "collapse 0.5s cubic-bezier(0, 0, 0, 1.46) forwards"
	tomlInputContainer.style.animation = COLLAPSE
	isCollapsed = true
	collapseButton.textContent = ">"
}


function unCollapseInput() {
	const UN_COLLAPSE = "un-collapse 0.5s cubic-bezier(0, 0, 0, 1.46) forwards"
	tomlInputContainer.style.animation = UN_COLLAPSE
	isCollapsed = false
	collapseButton.textContent = "<"
}


collapseButton.onclick = function() {
	if (!isCollapsed) { collapseInput(); }
	else { unCollapseInput(); }
}


function loadingScreenCrafting() {
	unCollapseInput();
}


function drag_trees(mouse_offset) {
	dragX = (mouseX - dragOffsetX) / scale
	dragY = (mouseY - dragOffsetY) / scale

	trees.style.transform = `translate(${dragX}px, ${dragY}px)`
}
function on_start_drag() {
	dragOffsetX = mouseX - dragX * scale
	dragOffsetY = mouseY - dragY * scale
	isDragging = true
}
function dragLoop() {
	if (isDragging) { drag_trees() }

	requestAnimationFrame(dragLoop)
}


treeStatic.onmousedown = on_start_drag
document.addEventListener("mouseup", function() { isDragging = false })
treeStatic.addEventListener("wheel", function(event) {
	scale += (-event.deltaY / 500)
	scale = Math.max(0.2, scale)
	treeScale.style.transform = `scale(${scale})`
})

document.addEventListener("DOMContentLoaded", dragLoop)