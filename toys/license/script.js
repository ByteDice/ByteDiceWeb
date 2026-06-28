CURRENT_PAGE = PAGES.LICENSE


async function loadingScreenLicense() {
	setLoadingProgress("Preparing license...")

	const VMAP = {
		title:     "titleValue",
		user:      "authorValue",
		issued:    "createdValue",
		expires:   "expireValue",
		identity:  "genderValue",
		signature: "signatureValue",
		img:       "picValue",
		id:        "hashID"
	}

	function getE(e) { return document.getElementById(e) }

	license.titleE     = getE(VMAP.title)
	license.userE      = getE(VMAP.user)
	license.issuedE    = getE(VMAP.issued)
	license.expiresE   = getE(VMAP.expires)
	license.identityE  = getE(VMAP.identity)
	license.signatureE = getE(VMAP.signature)
	license.imgE       = getE(VMAP.img)
	license.idE        = getE(VMAP.id)

	for (let i = 0; i < 10; i++) {
		license.sillyValues.push(document.getElementById(`sillyValue${i}`))
	}

	setLoadingProgress("Preparing options...")
	prepInputs()
	await updLicense();
	scaleDisplayLicense();
}