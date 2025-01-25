CURRENT_PAGE = PAGES.LICENSE

const inputOutputMap = {
  titleInput: "titleValue",
  authorInput: "authorValue",
  createdInput: "createdValue",
  expireInput: "expireValue",
  identityInput: "genderValue",
  signatureInput: "signatureValue",
}

for (const [inputId, outputId] of Object.entries(inputOutputMap)) {
  const inputElement = document.getElementById(inputId)
  const outputElement = document.getElementById(outputId)
  const outputElement_600x400 = document.getElementById(`${outputId}_600x400`)

  if (inputElement && outputElement) {
    inputElement.oninput = function () {
      outputElement.innerHTML = this.value
      outputElement_600x400.innerHTML = this.value
    }
  }
}

const sillyInput = document.getElementById("sillyInput")
const sillyValue = document.getElementById("sillyValue")
const sillyValue_600x400 = document.getElementById("sillyValue_600x400")
const sillyNumberValue = document.getElementById("sillyNumberValue")

if (sillyInput && sillyValue && sillyNumberValue) {
  sillyInput.oninput = function () {
    setSillyValue(this.value)
  }
}

function setSillyValue(value) {
  sillyNumberValue.innerHTML = prependZero(value)
  sillyValue.style.width = `${value * 10 + 0.1}%`
  sillyValue_600x400.style.width = `${value * 10 + 0.1}%`

  let percent = value == 0 ? 0 : 100 / value
  let bgImg = `
    repeating-linear-gradient(
      to right, 
      #000000 0px, 
      #000000 3px,
      transparent 3px, 
      transparent ${percent}%
    )
  `
  sillyValue.style.backgroundImage = bgImg
  sillyValue_600x400.style.backgroundImage = bgImg
}

const picInput = document.getElementById("picInput")
const picValue = document.getElementById("picValue")
const picValue_600x400 = document.getElementById("picValue_600x400")
const picUpload = document.getElementById("picUpload")
const customPicOption = document.getElementById("customPic")

function setPictureValue() {
  if (picInput.value != "custom") {
    let src = `/assets/boykissers/${picInput.value}.png`
    picValue.src = src
    picValue_600x400.src = src
  }
  else {
    if (picUpload.files.length > 0) {
      const file = picUpload.files[0]
      const fileName = file.name
      let src = URL.createObjectURL(file)
      picValue.src = src
      picValue_600x400.src = src
      customPicOption.innerHTML = `Custom (${fileName})`
    }
    else {
      customPicOption.innerHTML = "Custom (upload)"
    }
  }
}

picUpload.oninput = function() { setPictureValue() }

picInput.oninput = function() { setPictureValue() }

function prependZero(number) {
  return number < 10 ? "0" + number : number
}

function onLoadLicense() {
  for (const [inputId, outputId] of Object.entries(inputOutputMap)) {
    const inputElement = document.getElementById(inputId)
    const outputElement = document.getElementById(outputId)
    const outputElement_600x400 = document.getElementById(`${outputId}_600x400`)

    if (inputElement && outputElement) {
      outputElement.innerHTML = inputElement.value
      outputElement_600x400.innerHTML = inputElement.value
    }
  }

  if (sillyInput) {
    setSillyValue(sillyInput.value)
  }

  if (picInput) {
    setPictureValue()
  }
}
