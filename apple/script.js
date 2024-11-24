// Import Three.js and GLTFLoader for loading 3D models
const scene = new THREE.Scene();

// Set background color here (for example, dark gray)
scene.background = new THREE.Color(0x1a1a1a); // Dark gray background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3); // Move the camera closer to make the model appear larger

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Add a light source
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5); // Position the light
scene.add(directionalLight);

// Load 3D model from a public URL
const loader = new THREE.GLTFLoader();
let model;

loader.load(
    "./apple-vision-pro-Dexton/source/apple-vision-pro.glb", // Replace with your 3D model URL
    (gltf) => {
        model = gltf.scene;
        model.scale.set(2, 2, 2); // Increase the model size
        model.rotation.set(0, Math.PI, 0); // Rotate the model if needed
        scene.add(model);
        animate(); // Start animation loop after model loads
    },
    (xhr) => {
        console.log(`Model ${xhr.loaded / xhr.total * 100}% loaded`);
    },
    (error) => {
        console.error("An error occurred loading the model:", error);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Optional: Slowly rotate the model
    if (model) {
        model.rotation.y += 0.01; // Slow rotation on the Y-axis
    }

    renderer.render(scene, camera);
}

// Scroll-triggered animation using GSAP
function addScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger: "#canvas-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
            if (model) {
                // We won't change the model's position, just keep it stable
                // Optionally, you can modify the rotation on the Y-axis, but no other transformation
                model.rotation.y = self.progress * Math.PI * 0.2; // Slower rotation based on scroll progress
            }
        },
    });
}

// Call scroll animations once the model is loaded
addScrollAnimations();

// Resize handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
