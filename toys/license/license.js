const sillyOptNumber = document.getElementById("sillyNumberValue")


class License {
	constructor() {
		this.idE        = undefined
		this.imgE       = undefined
		this.userE      = undefined
		this.titleE     = undefined
		this.issuedE    = undefined
		this.expiresE   = undefined
		this.identityE  = undefined
		this.signatureE = undefined

		this.sillyE = undefined

		this.sillyValues = []
	}


	async updateFromJSON(json) {
		this.userE     .textContent = json.user
		this.titleE    .textContent = json.title
		this.issuedE   .textContent = json.issued
		this.expiresE  .textContent = json.expires
		this.identityE .textContent = json.identity
		this.signatureE.textContent = json.signature

		this.setSillyValue(json.silly)
		this.setImgValue(json.img)

		let hash = await sha256(JSON.stringify(json))
		this.idE.textContent = "NR-ID: " + hash.slice(0, 16)
	}


	setSillyValue(value) {
		sillyOptNumber.innerHTML = prependZero(value)
		
		for (let i in this.sillyValues) {
			let sillyValue = this.sillyValues[i]

			let isTurnedOn = i <= value - 1

			if (isTurnedOn) {
				sillyValue.className = "sillyValue on"
			}
			else {
				sillyValue.className = "sillyValue off"
			}
		}
	}


	setImgValue(json) {
		if (json.preset != "custom")
			{ this.imgE.src = `/assets/boykissers/${json.preset}.png` }
		else { this.imgE.src = json.file }
	}
}


let licenseE = document.getElementById("licenseContainer")
let anchor = document.getElementById("licenseAnchor")
let optContainer = document.getElementById("optionsContainer")

let license = new License()


function prependZero(number) {
  return number < 10 ? "0" + number : number
}


function scaleDisplayLicense() {
	let w = optContainer.getBoundingClientRect().width
	let scaleFactor = (w - 50) / 600;

	anchor.style.transform = `scale(${scaleFactor})`
}


