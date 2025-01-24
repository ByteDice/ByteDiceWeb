let usePostProcessing = true

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true })

const composer = new THREE.EffectComposer(renderer)

composer.setSize(window.innerWidth, window.innerHeight)

const renderPass = new THREE.RenderPass(scene, camera)
composer.addPass(renderPass)

const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter,
  format: THREE.RGBAFormat,
  type: THREE.UNSIGNED_BYTE
})

let shaderMaterial
let shaderPass


function defShaderMaterial() {
  shaderMaterial = makeShaderMaterial()

  shaderPass = new THREE.ShaderPass(shaderMaterial)
  composer.addPass(shaderPass)
  shaderPass.material.uniforms.tDiffuse.value = renderTarget.texture
}


function makeShaderMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;

      uniform vec3 edgeColor;
      uniform vec3 centerColor;
      uniform sampler2D tDiffuse;
      uniform float pxDensity;
      uniform vec2 resolution;

      float brightness(vec3 c) {
        return (c.r + c.g + c.b) / 3.0;
      }

      void main() {
        vec2 uv = vUv;

        vec2 screenPxCount = vec2(resolution.x / pxDensity, resolution.y / pxDensity);
        //screenPxCount = vec2(256.0, 164.0);
        vec2 p = floor(uv * screenPxCount) / screenPxCount;

        vec4 color = texture2D(tDiffuse, p);

        float b = brightness(color.rgb);
        float centerB = brightness(centerColor);
        float alpha = floor(color.a);

        if (b > centerB) {
          gl_FragColor = vec4(edgeColor, color.a);
        }
        else if (color == vec4(0.0)) {
          gl_FragColor = vec4(0.0);
        }
        else {
          gl_FragColor = vec4(centerColor, color.a);
        }
        
        //gl_FragColor = color;
      }
    `,
    uniforms: {
      edgeColor: { value: new THREE.Color(0x00b4f0) },
      centerColor: { value: new THREE.Color(0x323232) },
      tDiffuse: { value: null },
      pxDensity: { value: pxDensity },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }
  })
}


function updateShaderMatPxDensity() {
  shaderMaterial.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
  shaderMaterial.uniforms.pxDensity.value = pxDensity
}


// TODO: add pixelation shader

if (!renderer) {
  alert("Renderer failed to load, using static images instead.")
  // TODO: add image logic
  throw new Error("Renderer initialization failed.")
}

renderer.setSize(window.innerWidth, window.innerHeight)

const mainCanvas = document.getElementById("canvasContainer")
mainCanvas.appendChild(renderer.domElement)

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

debugPrint(
  "Camera transform",
  `Pos: [x: ${camera.position.x}, y: ${camera.position.y}, z: ${camera.position.z}]
Rot: [x: ${camera.rotation.x}, y: ${camera.rotation.y}, z: ${camera.rotation.z}]`
)

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

      float edgeThresholdX = 0.075;
      float edgeThresholdY = 0.075;

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
      resolution: { value: new THREE.Vector2(width / segments, length) }
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
      15, //camera.aspect * 10,
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
  debugPrint("Pre-animated synthwave complete")
}


let lastTime = 0
const tickRate = 12
let tickMultiplier = 1
let distSinceLastHill = 0

function animateSynthwave(timestamp) {
  let deltaTime = (timestamp - lastTime) / 1000
  lastTime = timestamp

  let currentTickRate = 1 / deltaTime
  tickMultiplier = tickRate / currentTickRate

  if (!hasPreAnimated) { return }

  if (!isAnimating) {
    render()
    return 
  }
  
  const moveDist = 0.0035 //0.05 * tickMultiplier
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
      15, //camera.aspect * 10,
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

  render()
}


function render() {
  if (usePostProcessing) {
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)

    renderer.setRenderTarget(null)
    composer.render()

    requestAnimationFrame(animateSynthwave)
  }
  else {
    renderer.setRenderTarget(null)
    renderer.render(scene, camera)

    requestAnimationFrame(animateSynthwave)
  }
}


function onResizeSynthwave() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  if (shaderMaterial) { updateShaderMatPxDensity() }
}