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
const sillyNumberValue = document.getElementById("sillyNumberValue")
let sillyValues = []
let sillyValues_600x400 = []

for (let i = 0; i < 10; i++) {
  sillyValues.push(document.getElementById(`sillyValue${i}`))
  sillyValues_600x400.push(document.getElementById(`sillyValue${i}_600x400`))
}


if (sillyInput && sillyValues && sillyNumberValue) {
  sillyInput.oninput = function () {
    setSillyValue(this.value)
  }
}


function setSillyValue(value) {
  sillyNumberValue.innerHTML = prependZero(value)
  

  for (let i in sillyValues) {
    let sillyValue = sillyValues[i]
    let sillyValue_600x400 = sillyValues_600x400[i]

    let isTurnedOn = i <= value - 1

    if (isTurnedOn) {
      sillyValue.className = "sillyValue on"
      sillyValue_600x400.className = "sillyValue_600x400 on"
    }
    else {
      sillyValue.className = "sillyValue off"
      sillyValue_600x400.className = "sillyValue_600x400 off"
    }
  }
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


function generateLicense() {
  const element = document.getElementById("licenseContainer_600x400")
  
  html2canvas(element).then(canvas => {
    const link = document.createElement("a");
    link.download = "boykisserLicense.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
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
