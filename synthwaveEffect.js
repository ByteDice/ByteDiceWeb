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
  -1, 0, 1,
  -1, 1, -1,
  1, 1, 1,
  1, 0, -1
]

let meshIndices = [
  0, 1, 2,
  1, 2, 3
]


geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(meshVerts), 3))
geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(meshIndices), 1))
geometry.computeVertexNormals()

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false, side: THREE.DoubleSide })
const mesh = new THREE.Mesh(geometry, material)

//scene.add(mesh)


camera.position.z = 5
camera.position.y = 2


function hillCurve(x, width) {
  return (Math.sin(Math.PI * (x + 1)) + 1) ** width
}


function generateHill(width, length, segments, maxHeight, posOffsetZ = 0, prevHillVerts = []) {
  let hillVerts = []
  let hillIndices = []
  let startPos = -width / 2
  let triCount = segments + 1

  let prevHillHeights = prevHillVerts.filter((_, index) => (index - 1) % 3 === 0)

  for (i = 0; i < triCount; i++) {
    let height = randomFloat(0, maxHeight) * hillCurve(i / triCount, 1.2)

    hillVerts.push(i / (triCount - 1) * width + startPos)

    if (prevHillHeights.length / 2 != segments + 1) {
      hillVerts.push(0)
    }
    else {
      hillVerts.push(prevHillHeights[i * 2 + 1])
    }

    hillVerts.push(length / 2 + posOffsetZ)

    hillVerts.push(i / (triCount - 1) * width + startPos)
    hillVerts.push(height)
    hillVerts.push(-length / 2 + posOffsetZ)
  }

  for (let i = 0; i < hillVerts.length / 2 - (segments + 3); i++) {
    hillIndices.push(i)
    hillIndices.push(i + 1)
    hillIndices.push(i + 2)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(hillVerts), 3))
  geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(hillIndices), 1))
  geometry.computeVertexNormals()

  const material = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, side: THREE.DoubleSide })
  const newMesh = new THREE.Mesh(geometry, material)

  return {mesh: newMesh, verts: hillVerts, indices: hillIndices}
}


function animate() {
  requestAnimationFrame(animate)
  
  renderer.render(scene, camera)
}

let newHill = generateHill(camera.aspect * 10, 2, 25, 4)

scene.add(newHill.mesh)
scene.add(generateHill(camera.aspect * 10, 2, 25, 4, -2, newHill.verts).mesh)
animate()


function onResizeSynthWave() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}