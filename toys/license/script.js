CURRENT_PAGE = PAGES.LICENSE

const sillyInput = document.getElementById("sillyInput")

const sillyNumberValue = document.getElementById("sillyNumberValue")

function prependZero(number) {
  if (number < 10)
    return "0" + number
  else
    return number
}

sillyInput.oninput = function() {
  sillyNumberValue.innerHTML = prependZero(this.value)
}


function onLoadLicense() {
  sillyNumberValue.innerHTML = prependZero(sillyInput.value)
}