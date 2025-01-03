import SceneManager from './SceneManager.js';
import CameraManager from './CameraManager.js';
import Object from './Objects.js';
import {Sphere} from './Objects.js';
import {Cube} from './Objects.js';

// import {Module} from './Render.js';

console.log("MainScript.js is running.");


// // Show the texture menu
// document.getElementById('goToTextureMenu').addEventListener('click', function() {
    //     document.getElementById('materialSelection').classList.add('hidden');
    //     document.getElementById('textureSelection').classList.remove('hidden');
    // });
    
    // // Show the material menu
    // document.getElementById('goToMaterialMenu').addEventListener('click', function() {
        //     document.getElementById('textureSelection').classList.add('hidden');
        //     document.getElementById('materialSelection').classList.remove('hidden');
        // });
        
const sceneManager = new SceneManager();
sceneManager.init();
let renderer = sceneManager.renderer;
let camera = sceneManager.camera;
let scene = sceneManager.scene;
const cameraManager = new CameraManager(camera);
cameraManager.init();

window.ready = false;

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1); // Sky color, ground color, intensity
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color, intensity
directionalLight.position.set(5, 10, 7.5); // Position the light
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Color, intensity
scene.add(ambientLight);


// Start the animation loop
function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
}
animate();

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('frontPageCanvas').classList.add('hidden');
    document.getElementById('menuCanvas').classList.remove('hidden');
    document.getElementById('menuCanvas').classList.add('visible');
    sceneManager.toggleControls();
    console.log('started');
});

document.getElementById('readyButton').addEventListener('click', () => {
    console.log("Pausing 3D space. Getting ready for rendering.");
    const lookAt = cameraManager.calculateLookAt();
    sceneManager.readyRaytracing(lookAt);
    window.ready = true;
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('renderButton').disabled = false;
});

document.getElementById('renderButton').addEventListener('click', () => {
    sceneManager.toggleControls();
    sceneManager.hideMenu();
});

document.getElementById('resetButton').addEventListener('click', () => {
    if (!window.ready) {return;}
    console.log("Unpausing 3D space.");
    sceneManager.toggleControls();
    window.ready = false;
    const canvas = document.getElementById('mySecondCanvas');
    canvas.style.display = 'none';
    animate();
    document.getElementById('resetButton').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('renderButton').disabled = true;
});

// document.addEventListener('keydown', (event) => {
//     if (event.key === 'b') {
//         console.log("Pausing 3D space. Getting ready for rendering.");
//         sceneManager.toggleControls();
//         cameraManager.toggleControls();
//         sceneManager.hideMenu();
//         window.ready = true;
//         const lookAt = cameraManager.calculateLookAt();
//         sceneManager.readyRaytracing(lookAt);
//         console.log("Ready to render. Press R to render.");
//     }
// });

document.addEventListener('keydown', (event) => {
    if (event.key === 'n') {
    }
});


document.addEventListener('keydown', (event) => {
    if (event.key === 'm') {
        console.log("Adding a new object and animating its movement.");

        const loader = new THREE.GLTFLoader();
        loader.load('models/digital_camera.glb', (gltf) => {
            // Add the loaded model to the scene
            const model = gltf.scene;

            // model.traverse((child) => {
            //     if (child.isMesh) {
            //         child.material = new THREE.MeshStandardMaterial({
            //             color: 0x808080, // Base color
            //             roughness: 0.5, // Adjust for shininess
            //             metalness: 0.2, // Adjust for metallic look
            //         });
            //     }
            // });
            
            model.scale.set(1, 1, 1);
            // Set its initial position relative to the camera
            const startDistance = -1;
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            model.position.copy(camera.position).add(direction.multiplyScalar(startDistance));
            scene.add(model);
            // Define the animation path
            const startPosition = model.position.clone();
            const endDistance = -5;
            const endPosition = camera.position.clone().add(direction.multiplyScalar(endDistance));
    
            // Animation loop for the movement
            const duration = 1; // Duration in seconds
            const startTime = performance.now();
            function animateMovement() {
                const elapsedTime = (performance.now() - startTime) / 1000; // Time in seconds
                const t = Math.min(elapsedTime / duration, 1); // Clamp t between 0 and 1
            
                // Interpolate position
                model.position.lerpVectors(startPosition, endPosition, t);
            
                // Interpolate rotation
                const startRotation = new THREE.Euler(0, 0, 0); // Initial rotation
                const endRotation = new THREE.Euler(0, Math.PI / 2, 0); // Target rotation (90 degrees on Y-axis)
                model.rotation.x = THREE.MathUtils.lerp(startRotation.x, endRotation.x, t);
                model.rotation.y = THREE.MathUtils.lerp(startRotation.y, endRotation.y, t);
                model.rotation.z = THREE.MathUtils.lerp(startRotation.z, endRotation.z, t);
            
                // Stop the animation when completed
                if (t < 1) {
                    requestAnimationFrame(animateMovement);
                } else {
                    console.log("Animation complete.");
                }
            }
                  
    
            animateMovement(); // Start the animation
            
        }, undefined, (error) => {
            console.log("Model loading error.");
        });

    }
});