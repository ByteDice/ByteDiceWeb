CURRENT_PAGE = PAGES.SYNTHWAVE

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true })

// TODO: when tabbing out it sometimes doesnt pause the animation (maybe fixed? Needs more testing)
// TODO: add pixelation shader

if (!renderer) {
  alert("Renderer failed to load, using static images instead.")
  // TODO: add image logic
  throw new Error("Renderer initialization failed.")
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
geometry.computeBoundingBox()

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false, side: THREE.DoubleSide })
const mesh = new THREE.Mesh(geometry, material)

//scene.add(mesh)

// "toward sun"
/* camera.position.z = 5
camera.position.y = 2 */

// far away "toward sun"
camera.position.z = 0
camera.position.y = 1
camera.rotation.x = 0.2

// top down
/* camera.position.y = 5
camera.lookAt(0, 0, 0) */

function hillCurve(x, width) {
  return (Math.sin(Math.PI * (x + 1)) + 1) ** width
}


function generateHill(width, length, segments, maxHeight, posOffsetZ = 0, prevHillVerts = []) {
  let hillIndices = []
  let startPos = -width / 2
  let triCount = segments + 1

  let prevHillHeights = prevHillVerts.filter((_, index) => (index - 1) % 3 === 0)

  let hillData = generateHillVerts(
    triCount,
    maxHeight,
    width,
    startPos,
    prevHillHeights,
    segments,
    length,
    posOffsetZ
  )
  let hillVerts = hillData.verts
  let hillUVs = hillData.uvs

  for (let i = 0; i < segments; i++) {
    hillIndices.push(i * 2, i * 2 + 2, i * 2 + 1)
    hillIndices.push(i * 2 + 1, i * 2 + 2, i * 2 + 3)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(hillVerts), 3))
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(hillUVs), 2))
  geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(hillIndices), 1))
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()

  const material = generateHillMat(segments, width, length)
  const newMesh = new THREE.Mesh(geometry, material)

  newMesh.position.z = posOffsetZ

  return {mesh: newMesh, verts: hillVerts, indices: hillIndices}
}


function generateHillVerts(
  triCount,
  maxHeight,
  width,
  startPos,
  prevHillHeights,
  segments,
  length
) {
  let hillVerts = []
  let hillUVs = []

  for (let i = 0; i < triCount; i++) {
    let height = randomFloat(0, maxHeight) * hillCurve(i / triCount, 1.2)

    hillVerts.push(i / (triCount - 1) * width + startPos)

    if (prevHillHeights.length / 2 != segments + 1) { hillVerts.push(0) }
    else { hillVerts.push(prevHillHeights[i * 2 + 1]) }

    hillVerts.push(length / 2)

    hillUVs.push(i / (triCount - 1), 0)

    hillVerts.push(
      i / (triCount - 1) * width + startPos,
      height,
      -length / 2
    )
    hillUVs.push(i / (triCount - 1), 1)
  }

  return {verts: hillVerts, uvs: hillUVs}
}


function generateHillMat(segments, width, length) {
  //return new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: false })

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    varying vec2 vUv;
    uniform vec3 edgeColor;
    uniform vec3 centerColor;
    uniform int segmentCount;
    uniform vec2 resolution;

    void main() {
      vec2 uv = vUv;
      uv.x = fract(uv.x * float(segmentCount));

      float edgeThresholdX = 0.1;
      float edgeThresholdY = 0.1;

      if (resolution.x > resolution.y) {
        edgeThresholdX *= resolution.y / resolution.x;
      }
      else {
        edgeThresholdY *= resolution.x / resolution.y;
      }

      float isEdge = 0.0;
      
      if (uv.y < edgeThresholdY || uv.y > (1.0 - edgeThresholdY)) {
        isEdge = 1.0;
      }
      
      if (uv.x < edgeThresholdX || uv.x > (1.0 - edgeThresholdX)) {
        isEdge = 1.0;
      }

      vec3 color = mix(centerColor, edgeColor, isEdge);

      gl_FragColor = vec4(color, 1.0);
    }
  `

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      edgeColor: { value: new THREE.Color(0x00b4f0) },
      centerColor: { value: new THREE.Color(0x323232) },
      segmentCount: { value: segments },
      resolution: { value: [width / segments, length] }
    }
  })

  return material
}


let allHillMeshes = []

function addHillMesh(mesh) {
  allHillMeshes.push(mesh)
  scene.add(mesh)
}


const hillLength = 1.2
let hillSpawnOffset = -25
let lastHillVerts = []
let hasPreAnimated = false

function preAnimateSynthwave(times) {
  for (let i = 0; i < times; i++) {
    let hillOffset = -(i * hillLength) + 0.02

    let newHill = generateHill(
      camera.aspect * 10,
      hillLength,
      25,
      4,
      hillOffset,
      lastHillVerts
    )

    addHillMesh(newHill.mesh)
    lastHillVerts = newHill.verts
    hillSpawnOffset = hillOffset
  }

  hasPreAnimated = true
}


let lastTime = 0
const tickRate = 12
let tickMultiplier = 1
let distSinceLastHill = 0

function animateSynthwave(timestamp) {
  let deltaTime = (timestamp - lastTime) / 1000
  lastTime = timestamp;

  let currentTickRate = 1 / deltaTime
  tickMultiplier = tickRate / currentTickRate

  if (!hasPreAnimated) { return }

  if (!isAnimating) {
    renderer.render(scene, camera)
    requestAnimationFrame(animateSynthwave)
    return 
  }
  
  const moveDist = 0.05 * tickMultiplier
  distSinceLastHill += moveDist

  for (let hill of allHillMeshes) {
    hill.position.z += moveDist
    
    const outOfBoundsCoord = camera.aspect * 75
    if (hill.position.z - hill.geometry.boundingBox.min.y >= outOfBoundsCoord) {
      scene.remove(hill)
    }
  }

  if (distSinceLastHill >= hillLength) {

    let hillZOffset = hillLength - distSinceLastHill

    let newHill = generateHill(
      camera.aspect * 10,
      hillLength,
      25,
      4,
      hillZOffset + 0.02 + hillSpawnOffset,
      lastHillVerts
    )

    addHillMesh(newHill.mesh)
    distSinceLastHill = -hillZOffset
    lastHillVerts = newHill.verts
  }

  renderer.render(scene, camera)

  requestAnimationFrame(animateSynthwave)
}


function onResizeSynthwave() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}