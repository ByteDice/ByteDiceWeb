let jsonData = {
	version: 0,
	title: "Boykisser License",
	user: "Byte Dice",
	issued: "2025-01-01",
	expires: "NEVER!!!",
	identity: "any pronouns",
	signature: "Byte Dice",
	silly: 3,
	img: {
		preset: "boykisser",
		file: ""
	}
}


const customPicOption = document.getElementById("customPic")


function prepInputs() {
	const VMAP = {
		img:       "picInput",
		user:      "authorInput",
		title:     "titleInput",
		silly:     "sillyInput",
		issued:    "createdInput",
		expires:   "expireInput",
		identity:  "identityInput",
		signature: "signatureInput",
		imgUpload: "picUpload"
	}

	function getE(e) { return document.getElementById(e) }

	getE(VMAP.img)      .oninput = function() { jsonData.img.preset = this.value; updLicense() }
	getE(VMAP.user)     .oninput = function() { jsonData.user = this.value; updLicense() }
	getE(VMAP.title)    .oninput = function() { jsonData.title = this.value; updLicense() }
	getE(VMAP.silly)    .oninput = function() { jsonData.silly = this.value; updLicense() }
	getE(VMAP.issued)   .oninput = function() { jsonData.issued = this.value; updLicense() }
	getE(VMAP.expires)  .oninput = function() { jsonData.expires = this.value; updLicense() }
	getE(VMAP.identity) .oninput = function() { jsonData.identity = this.value; updLicense() }
	getE(VMAP.signature).oninput = function() { jsonData.signature = this.value; updLicense() }

	getE(VMAP.imgUpload).oninput = function() {
		if (this.files.length == 0) { return; }
		let f = this.files[0]
		jsonData.img.file = URL.createObjectURL(f)
		customPicOption.innerHTML = `Custom (${f.name})`

		updLicense()
	}
}


function updLicense() { license.updateFromJSON(jsonData) }


function importData() {
	let data = prompt("Input your license data here.")
	importFromB64(data)
}


function importFromB64(b64) {
	if (b64.startsWith("B8D6:")) { b64 = b64.slice(5) }

	try {
		let str = atob(b64)
		data = JSON.parse(str)
		let isValid = validateJSON_v0(data)
		if (isValid != true)
			{ alert("Invalid data string imported (Invalid fields). Full results:\n" + isValid.join("\n")); return }
	
		jsonData = data
		updLicense()
	}
	catch (err) { alert("Invalid data string imported. Full results:\n" + err); return }
}


// I wanna keep compatibility with older versions
function validateJSON_v0(obj) {
	let is_valid = (
		typeof obj            === "object" &&
		       obj            !== null     &&
		typeof obj.version    === "number" &&
		typeof obj.title      === "string" &&
		typeof obj.user       === "string" &&
		typeof obj.issued     === "string" &&
		typeof obj.expires    === "string" &&
		typeof obj.identity   === "string" &&
		typeof obj.signature  === "string" &&
		typeof obj.silly      === "number"
	)

	if (is_valid) { return true }

	let errs = []
	if (typeof obj !== "object") { errs.push("json != object") }
	if (obj === null) { errs.push("json == null") }

	if (typeof obj.user !== "string")        { errs.push("json.user != string") }
	if (typeof obj.title !== "string")       { errs.push("json.title != string") }
	if (typeof obj.issued !== "string")      { errs.push("json.issued != string") }
	if (typeof obj.expires !== "string")     { errs.push("json.expires != string") }
	if (typeof obj.identity !== "string")    { errs.push("json.identity != string") }
	if (typeof obj.signature !== "string")   { errs.push("json.signature != string") }

	if (typeof obj.version !== "number") { errs.push("json.version != number") }
	if (typeof obj.silly !== "number") { errs.push("json.silly != number") }

	return errs
}



function exportData() {
	let str = JSON.stringify(jsonData)
	let b64 = btoa(str)
	let watermarked = "B8D6:" + b64
	navigator.clipboard.writeText(watermarked)

	alert("Data copied to clipboard! Keep in mind that images do not get exported.\n\nIf it didn't work, you can manually copy it below:\n\n" + watermarked)
}


function generateLicense() {
  const element = document.getElementById("licenseContainer")
	let dupe = element.cloneNode(true)
  dupe.style.transform = "initial"
	dupe.style.left = "300vw"
	dupe.style.position = "absolute"
	dupe.style.margin = "initial"

	document.body.appendChild(dupe)

  html2canvas(dupe).then(canvas => {
    const link = document.createElement("a");
    link.download = "boykisserLicense.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

	console.log(dupe.getBoundingClientRect())

	dupe.remove()
}