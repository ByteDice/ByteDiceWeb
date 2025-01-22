CURRENT_PAGE = PAGES.LICENSE

const inputOutputMap = {
  titleInput: "titleValue",
  authorInput: "authorValue",
  createdInput: "createdValue",
  expireInput: "expireValue",
  identityInput: "genderValue",
  signatureInput: "signatureValue",
};

for (const [inputId, outputId] of Object.entries(inputOutputMap)) {
  const inputElement = document.getElementById(inputId);
  const outputElement = document.getElementById(outputId);

  if (inputElement && outputElement) {
    inputElement.oninput = function () {
      outputElement.innerHTML = this.value;
    };
  }
}

const sillyInput = document.getElementById("sillyInput");
const sillyValue = document.getElementById("sillyValue");
const sillyNumberValue = document.getElementById("sillyNumberValue");

if (sillyInput && sillyValue && sillyNumberValue) {
  sillyInput.oninput = function () {
    setSillyValue(this.value);
  };
}

function setSillyValue(value) {
  sillyNumberValue.innerHTML = prependZero(value);
  sillyValue.style.width = `${value * 10 + 0.1}%`;

  let percent = value == 0 ? 0 : 100 / value;
  sillyValue.style.backgroundImage = `
    repeating-linear-gradient(
      to right, 
      #000000 0px, 
      #000000 3px,
      transparent 3px, 
      transparent ${percent}%
    )
  `;
}

function setPictureValue() {

}

function prependZero(number) {
  return number < 10 ? "0" + number : number;
}

function onLoadLicense() {
  for (const [inputId, outputId] of Object.entries(inputOutputMap)) {
    const inputElement = document.getElementById(inputId);
    const outputElement = document.getElementById(outputId);

    if (inputElement && outputElement) {
      outputElement.innerHTML = inputElement.value;
    }
  }

  if (sillyInput) {
    setSillyValue(sillyInput.value);
  }
}
