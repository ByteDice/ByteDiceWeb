let navBarJson
let alts

navBarPresent = true

function onLoadNavBar() {
  const container = document.getElementById("navBarContainer")
  const altString = container.dataset.alt || ""
  alts = altString.replaceAll(" ", "").split(",")

  debugPrint("Navbar alts", alts.join(", "));

  if (!container) { return }

  const navBarAligner = document.createElement("div")
  navBarAligner.className = "navBarAligner"

  const navBar = document.createElement("ul")
  navBar.className = "navBar borderedRect"


  for (let btn of navBarJson) {
    createdBtn = createNavBarBtn(
      btn["icon"]        || "",
      btn["action"]      || "",
      btn["actionValue"] || "",
      btn["iconId"]      || "",
      btn["alt"]         || "",
      btn["disabled"]    || false,
      btn["hidden"]      || false
    )

    if (createdBtn != null) {
      navBar.appendChild(createdBtn)
    }
  }

  navBarAligner.appendChild(navBar)
  container.appendChild(navBarAligner)
}

function createNavBarBtn(icon = "", action = "", actionValue = "", iconId = "", alt = "", disabled = false, hidden = false) {
  if (alts.includes(alt["name"])) {
    icon        = alt["icon"]        || icon        || ""
    action      = alt["action"]      || action      || ""
    actionValue = alt["actionValue"] || actionValue || ""
    iconId      = alt["iconId"]      || iconId      || ""

    disabled = alt["disabled"] === undefined ? disabled : alt["disabled"] || false;
    hidden = alt["hidden"] || false;
  }

  let onClick
  switch (action) {
    case "navigate": onClick = `slideTransition('${actionValue}', event)`; break
    case "function": onClick = `${actionValue}`; break
    default: ""
  }

  if (hidden) { return null; }

  let btn = document.createElement("li")

  btn.innerHTML = `
    <button onclick="${onClick}" class="navBtn" ${disabled == true ? "disabled" : ""}>
      <img class="navBtnImg" draggable="false" src="/assets/navBarBtn.png">
      <img class="navBtnIcon" draggable="false" src="/assets/icons/${icon}" id="${iconId}">
    </button>
  `

  return btn;
}

async function loadNavBarJson() {
  let navBarText = await fetch("/data/navBar.json").then(response => response.text())
  navBarJson = JSON.parse(navBarText)
  console.log(navBarJson)
}

