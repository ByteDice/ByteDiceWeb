const canvas = document.getElementById("synthwaveCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL not supported, using static image.");
}