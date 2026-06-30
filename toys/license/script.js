CURRENT_PAGE = PAGES.LICENSE


async function loadingScreenLicense() {
	setLoadingProgress("Preparing license...")

	const VMAP = {
		id:        "hashID",
		img:       "picValue",
		user:      "authorValue",
		base:      "licenseContainer",
		title:     "titleValue",
		issued:    "createdValue",
		expires:   "expireValue",
		identity:  "genderValue",
		signature: "signatureValue"
	}

	function getE(e) { return document.getElementById(e) }

	license.idE        = getE(VMAP.id)
	license.imgE       = getE(VMAP.img)
	license.userE      = getE(VMAP.user)
	license.baseE      = getE(VMAP.base)
	license.titleE     = getE(VMAP.title)
	license.issuedE    = getE(VMAP.issued)
	license.expiresE   = getE(VMAP.expires)
	license.identityE  = getE(VMAP.identity)
	license.signatureE = getE(VMAP.signature)

	for (let i = 0; i < 10; i++) {
		license.sillyValues.push(document.getElementById(`sillyValue${i}`))
	}

	setLoadingProgress("Preparing options...")
	prepInputs()
	makeOptionsTheSameAsJSON()
	scaleDisplayLicense()
	await updLicense()
}