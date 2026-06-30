let jsonData = {
	version: 1,
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
	},
	bg: {
		type: "color",
		color: "#FFFFFF",
		file: ""
	},
	border: "#000000",
	text: "#000000"
}


const customPicOption = document.getElementById("customPic")
const customBgOption  = document.getElementById("customBg")


// funny size sorting
const VMAP = {
	bg:        "bgTypeInput",
	img:       "picInput",
	user:      "authorInput",
	text:      "textColInput",
	title:     "titleInput",
	silly:     "sillyInput",
	bgCol:     "bgColInput",
	issued:    "createdInput",
	border:    "borderColInput",
	expires:   "expireInput",
	identity:  "identityInput",
	bgUpload:  "bgUpload",
	signature: "signatureInput",
	imgUpload: "picUpload",
}


async function prepInputs() {
	function getE(e) { return document.getElementById(e) }

	getE(VMAP.bg)       .oninput = async function() { jsonData.bg.type = this.value; await updLicense() }
	getE(VMAP.img)      .oninput = async function() { jsonData.img.preset = this.value; await updLicense() }
	getE(VMAP.user)     .oninput = async function() { jsonData.user = this.value; await updLicense() }
	getE(VMAP.text)     .oninput = async function() { jsonData.text = this.value; await updLicense() }
	getE(VMAP.title)    .oninput = async function() { jsonData.title = this.value; await updLicense() }
	getE(VMAP.silly)    .oninput = async function() { jsonData.silly = parseInt(this.value); await updLicense() }
	getE(VMAP.bgCol)    .oninput = async function() { jsonData.bg.color = this.value; await updLicense() }
	getE(VMAP.issued)   .oninput = async function() { jsonData.issued = this.value; await updLicense() }
	getE(VMAP.border)   .oninput = async function() { jsonData.border = this.value; await updLicense() }
	getE(VMAP.expires)  .oninput = async function() { jsonData.expires = this.value; await updLicense() }
	getE(VMAP.identity) .oninput = async function() { jsonData.identity = this.value; await updLicense() }
	getE(VMAP.signature).oninput = async function() { jsonData.signature = this.value; await updLicense() }

	getE(VMAP.imgUpload).onchange = async function() {
		if (this.files.length == 0) { return; }
		let f = this.files[0]
		jsonData.img.file = URL.createObjectURL(f)
		customPicOption.innerHTML = `Custom (${f.name})`

		await updLicense()
	}

	getE(VMAP.bgUpload).onchange = async function() {
		if (this.files.length == 0) { return; }
		let f = this.files[0]
		jsonData.bg.file = URL.createObjectURL(f)
		customBgOption.innerHTML = `Image (${f.name})`

		await updLicense()
	}
}


async function updLicense() { await license.updateFromJSON(jsonData) }


function importData() {
	let data = prompt("Input your license data here.")
	importFromB64(data)
}


async function importFromB64(b64) {
	if (b64.startsWith("B8D6:")) { b64 = b64.slice(5) }

	try {
		let str = atob(b64)
		data = JSON.parse(str)

		let isValid = validateJSON(data)

		if (isValid != true)
			{ alert("Invalid data string imported (Invalid fields). Full results:\n" + isValid.join("\n")); return }

		jsonData = deepOverride(jsonData, data)

		await updLicense()
		makeOptionsTheSameAsJSON()
	}
	catch (err) { alert("Invalid data string imported. Full results:\n" + err); return }
}


function deepOverride(target, source) {
	for (const key in source) {
		if (
			typeof source[key] === "object" &&
			source[key] !== null &&
			!Array.isArray(source[key])
		) { target[key] = deepOverride(target[key] ?? {}, source[key]) }
		else { target[key] = source[key] }
	}

	return target;
}


function makeOptionsTheSameAsJSON() {
	function getE(e) { return document.getElementById(e) }

	getE(VMAP.img).value = jsonData.img.preset
	getE(VMAP.user).value = jsonData.user
	getE(VMAP.text).value = jsonData.text
	getE(VMAP.title).value = jsonData.title
	getE(VMAP.silly).value = jsonData.silly
	getE(VMAP.bgCol).value = jsonData.bg.color
	getE(VMAP.issued).value = jsonData.issued
	getE(VMAP.border).value = jsonData.border
	getE(VMAP.expires).value = jsonData.expires
	getE(VMAP.identity).value = jsonData.identity
	getE(VMAP.signature).value = jsonData.signature
}


// I wanna keep compatibility with older versions
function validateJSON(obj) {
	let is_valid = (
		typeof obj            === "object" &&
					 obj            !== null     &&
		typeof obj.bg         === "object" &&
		typeof obj.user       === "string" &&
		typeof obj.title      === "string" &&
		typeof obj.silly      === "number" &&
		typeof obj.issued     === "string" &&
		typeof obj.expires    === "string" &&
		typeof obj.version    === "number" &&
		typeof obj.identity   === "string" &&
		typeof obj.signature  === "string" &&
		typeof obj.bg.color   === "string" &&
		typeof obj.border     === "string" &&
		typeof obj.text       === "string"
	)

	if (is_valid) { return true }

	let errs = []
	if (typeof obj !== "object") { errs.push("json != object") }
	if (obj === null) { errs.push("json == null") }

	if (typeof obj.bg !== "object")          { errs.push("json.bg != object") }
	if (typeof obj.user !== "string")        { errs.push("json.user != string") }
	if (typeof obj.text !== "string")        { errs.push("json.text != string") }
	if (typeof obj.title !== "string")       { errs.push("json.title != string") }
	if (typeof obj.issued !== "string")      { errs.push("json.issued != string") }
	if (typeof obj.border !== "string")      { errs.push("json.border != string") }
	if (typeof obj.expires !== "string")     { errs.push("json.expires != string") }
	if (typeof obj.identity !== "string")    { errs.push("json.identity != string") }
	if (typeof obj.bg.color !== "string")    { errs.push("json.bg.color != string") }
	if (typeof obj.signature !== "string")   { errs.push("json.signature != string") }

	if (typeof obj.version !== "number") { errs.push("json.version != number") }
	if (typeof obj.silly !== "number") { errs.push("json.silly != number") }

	return errs
}


function exportData() {
	let strippedData = jsonData
	delete strippedData.img.file
	delete strippedData.bg.file
	let str = JSON.stringify(strippedData)
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