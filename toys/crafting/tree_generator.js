import { parse } from "https://esm.sh/smol-toml"

let tomlInput = document.getElementById("tomlInput")
let genButton = document.getElementById("generateButton")
let trees = document.getElementById("trees")

let recipes = {}
let startItems = []
let products = []


genButton.onclick = getDataFromInput


function getDataFromInput() {
	let input = tomlInput.value
	try {
		let json = parse(input)

		startItems = json.io.inputs
		products = json.io.products
		recipes = json.recipes
	} catch (e) { alert(e) }

	clearTrees()

	for (let product of products) {
		console.log("generating: \"" + product + "\"")
		genTreeForProduct(product)
	}
}


function genTreeForProduct(product) {
	let treeData = RecursivelyGetRecipes(product)

	let treeNode = document.createElement("div")
	treeNode.className = "tree"

	makeTreeHTML(treeData, treeNode, true)

	trees.appendChild(treeNode)
}


function RecursivelyGetRecipes(product) {
	let recipe = recipes[product]

	if (recipe == undefined) {
		alert("ERROR: Recipe not found for \"" + product + "\"")
		return [product]
	}

	let children = []

	for (let item of recipe) {
		if (startItems.includes(item)) { children.push(item) }
		else { children.push(...RecursivelyGetRecipes(item)) }
	}

	return [product, children]
}


function prettyTreeString(tree, indent=0) {
	let string = ""

	for (let item of tree) {
		if (typeof item == "string")
			{ string += "| ".repeat(indent) + item + "\n" }
		else { string += prettyTreeString(item, indent + 1) }
	}

	return string
}


function clearTrees() {
	while (trees.firstChild)
		{ trees.firstChild.remove() }
}


function makeTreeHTML(tree, parentNode, blue = false) {
	let previouslyAdded = undefined

	let stringCount = tree.filter((x) => typeof(x) == "string").length
	let arrCount = tree.length - stringCount

	// add .siblings container if theres more than 1 .item
	if (stringCount > 1) {
		let s = document.createElement("div")
		s.className = "siblings"
		parentNode.prepend(s)
		parentNode = s
	}
	if (arrCount == 0) { blue = true }

	for (let i = 0; i < tree.length; i++) {
		if (typeof(tree[i]) == "string") {
			if (startItems.includes(tree[i])) { blue = true }
			let n = makeItemNode(tree[i], blue)
			parentNode.prepend(n)
			previouslyAdded = n
		}
		else { makeTreeHTML(tree[i], previouslyAdded, false) }
	}
}


function makeItemNode(name, blue = false) {
	let node = document.createElement("div")
	node.className = "item"
	let p = document.createElement("p")
	if (blue) { p.className = "blue" }
	p.textContent = name
	node.appendChild(p)

	return node
}