let navBarJson
let alts

function onLoadNavBar() {
  const container = document.getElementById("navBarContainer")
  const altString = container.dataset.alt || ""
  alts = altString.replace(" ", "").split(",")

  if (!container) { return }

  const navBarAligner = document.createElement("div")
  navBarAligner.className = "navBarAligner"

  const navBar = document.createElement("ul")
  navBar.className = "navBar borderedRect"


  for (let btn of navBarJson) {
    navBar.appendChild(createNavBarBtn(
      btn["icon"]        || "",
      btn["action"]      || "",
      btn["actionValue"] || "",
      btn["iconId"]      || "",
      btn["alt"]         || "",
      btn["disabled"]    || false
    ))
  }

  navBarAligner.appendChild(navBar)
  container.appendChild(navBarAligner)
}

function createNavBarBtn(icon = "", action = "", actionValue = "", iconId = "", alt = "", disabled = false) {
  if (alts.includes(alt["name"])) {
    icon        = alt["icon"]        || ""
    action      = alt["action"]      || ""
    actionValue = alt["actionValue"] || ""
    iconId      = alt["iconId"]      || ""
    disabled    = alt["disabled"]    || false
  }

  let onClick
  switch (action) {
    case "navigate": onClick = `slideTransition('${actionValue}', event)`; break
    case "function": onClick = `${actionValue}`; break
    default: ""
  }

  let btn = document.createElement("li")

  btn.innerHTML = `
    <button onclick="${onClick}" class="navBtn" ${disabled == true ? "disabled" : ""}>
      <img class="navBtnImg" draggable="false" src="/assets/navBarBtn.png">
      <img class="navBtnIcon" draggable="false" src="/assets/icons/${icon}" id="${iconId}">
    </button>
  `

  return btn
}

async function loadNavBarJson() {
  let navBarText = await fetch("/data/navBar.json").then(response => response.text())
  navBarJson = JSON.parse(navBarText)
  console.log(navBarJson)
}

