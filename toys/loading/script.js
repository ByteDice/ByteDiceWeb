CURRENT_PAGE = PAGES.LOADING


let byteDiceSize = 1
let loadingImg = undefined


function clearLoadingScreenClutter() {
  document.getElementById("fakeLoadingToggle").remove()
  loadingImg = document.getElementById("loadingImg")
}


function periodicallyChangeTips() {
  newTip()
  setLoadingProgress("")
}


function changeLoadingImgSize() {
  loadingImg.style.width  = `calc(${32 * byteDiceSize}px * var(--pxDensity))`
  loadingImg.style.height = `calc(${32 * byteDiceSize}px * var(--pxDensity))`
}


window.onkeydown = function(e) { // keycodes 48..57 = 0-9
  let code = e.keyCode

  if (!(code >= 48 && code <= 57)) { return }

  byteDiceSize = (code - 48) / 9 + 1
  changeLoadingImgSize()
}