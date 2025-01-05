CURRENT_PAGE = PAGES.SYNTHWAVE

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true })

if (!renderer) {
  alert("Renderer failed to load")
}

renderer.setSize(window.innerWidth, window.innerHeight)

const mainDiv = document.getElementById("canvasContainer")
mainDiv.appendChild(renderer.domElement)

renderer.setClearColor(0x000000, 0)

const geometry = new THREE.BufferGeometry()

let meshVerts = [
  1, 0, 1,
  -1, 0, 1,
  -1, 0, -1,
  1, 0, -1
]

let meshIndices = [
  0, 1, 2,
  0, 2, 3
]


geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(meshVerts), 3))
geometry.setIndex(new THREE.BufferAttribute(new Float32Array(meshIndices), 3))
geometry.computeVertexNormals()

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

camera.position.z = 5
camera.position.y = 2


function generateHill(width, length, segments, minHeight, maxHeight, prevHillVerts) {
  let hillVerts = []
  let startPos = -width / 2

  for (i = 0; i < segments; i++) {
    hillVerts.push(i / (segments - 1) * width + startPos)
    hillVerts.push(0)
    hillVerts.push(length / 2)

    hillVerts.push(i / (segments - 1) * width + startPos)
    hillVerts.push(0)
    hillVerts.push(-length / 2)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(hillVerts), 3))
  //geometry.setIndex(new THREE.BufferAttribute(new Float32Array(hillIndices), 3))
  //geometry.computeVertexNormals()

  const material = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true })
  const newMesh = new THREE.Mesh(geometry, material)

  return newMesh
}


function animate() {
  requestAnimationFrame(animate)
  
  renderer.render(scene, camera)
}

scene.add(generateHill(2, 2, 9))
animate()


function onResizeSynthWave() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}