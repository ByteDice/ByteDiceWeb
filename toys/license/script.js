CURRENT_PAGE = PAGES.LICENSE

const authorInput    = document.getElementById("authorInput")
const createdInput   = document.getElementById("createdInput")
const expireInput    = document.getElementById("expireInput")
const identityInput  = document.getElementById("identityInput")
const sillyInput     = document.getElementById("sillyInput")
const signatureInput = document.getElementById("signatureInput")

const authorValue    = document.getElementById("authorValue")
const createdValue   = document.getElementById("createdValue")
const expireValue    = document.getElementById("expireValue")
const genderValue    = document.getElementById("genderValue")
const sillyValue     = document.getElementById("sillyValue")
const signatureValue = document.getElementById("signature")

const sillyNumberValue = document.getElementById("sillyNumberValue")

function prependZero(number) {
  if (number < 10)
    return "0" + number
  else
    return number
}

authorInput.oninput = function() {
  authorValue.innerHTML = this.value
}
createdInput.oninput = function() {
  createdValue.innerHTML = this.value
}
expireInput.oninput = function() {
  expireValue.innerHTML = this.value
}
identityInput.oninput = function() {
  genderValue.innerHTML = this.value
}
sillyInput.oninput = function() {
  setSillyValue(this.value)
}
signatureInput.oninput = function() {
  signatureValue.innerHTML = this.value
}


function setSillyValue(value) {
  sillyNumberValue.innerHTML = prependZero(value)
  sillyValue.style.width = `${value * 10 + 0.1}%`

  let percent = value == 0 ? 0 : 100 / value
  sillyValue.style.backgroundImage = `
    repeating-linear-gradient(
      to right, 
    #000000 0px, 
    #000000 3px,
      transparent 3px, 
      transparent ${percent}%
    )
  `
}


function onLoadLicense() {
  authorValue.innerHTML    = authorInput.value
  createdValue.innerHTML   = createdInput.value
  expireValue.innerHTML    = expireInput.value
  genderValue.innerHTML    = identityInput.value
  signatureValue.innerHTML = signatureInput.value

  setSillyValue(sillyInput.value)
}