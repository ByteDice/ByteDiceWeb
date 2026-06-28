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

  if (inputElement && outputElement) {
    inputElement.oninput = function () {
      outputElement.innerHTML = this.value
    }
  }
}

const sillyInput = document.getElementById("sillyInput")
const sillyNumberValue = document.getElementById("sillyNumberValue")
let sillyValues = []

for (let i = 0; i < 10; i++) {
  sillyValues.push(document.getElementById(`sillyValue${i}`))
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

    let isTurnedOn = i <= value - 1

    if (isTurnedOn) {
      sillyValue.className = "sillyValue on"
    }
    else {
      sillyValue.className = "sillyValue off"
    }
  }
}

const picInput = document.getElementById("picInput")
const picValue = document.getElementById("picValue")
const picUpload = document.getElementById("picUpload")
const customPicOption = document.getElementById("customPic")

function setPictureValue() {
  if (picInput.value != "custom") {
    let src = `/assets/boykissers/${picInput.value}.png`
    picValue.src = src
  }
  else {
    if (picUpload.files.length > 0) {
      const file = picUpload.files[0]
      const fileName = file.name
      let src = URL.createObjectURL(file)
      picValue.src = src
      customPicOption.innerHTML = `Custom (${fileName})`
    }
    else {
      customPicOption.innerHTML = "Custom (upload)"
    }
  }
}

picUpload.oninput = function() { setPictureValue() }

picInput.oninput = function() { setPictureValue() }


function generateLicense() {
  const element = document.getElementById("licenseContainer")
  
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

    if (inputElement && outputElement) {
      outputElement.innerHTML = inputElement.value
    }
  }
  if (sillyInput) {
    setSillyValue(sillyInput.value)
  }

  if (picInput) {
    setPictureValue()
  }
}
