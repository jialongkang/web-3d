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

let isAnimating = true; // Flag to control animation
window.ready = false;

animate();

document.addEventListener('keydown', (event) => {
    if (event.key === 'b') {
        console.log("Pausing 3D space. Getting ready for rendering.");
        sceneManager.toggleControls();
        cameraManager.toggleControls();
        isAnimating = false; 

        window.ready = true;
        const lookAt = cameraManager.calculateLookAt();
        sceneManager.readyRaytracing(lookAt);
        // window.img_w = 800;
        // window.img_ar = 16.0/9.0; 
        // window.img_vfov = 75;
        // window.img_spp = 10;
        // window.cam_x = camera.position.x;
        // window.cam_y = camera.position.y;
        // window.cam_z = camera.position.z;
        // window.lookAt_x = lookAt.x;
        // window.lookAt_y = lookAt.y;
        // window.lookAt_z = lookAt.z;
        // const objects_info_list = sceneManager.updateObjectsInfoList();
        // window.objects_info = objects_info_list;
        console.log("Ready to render. Press R to render.");
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'n') {
        if (isAnimating) {return;}
        console.log("Unpausing 3D space.");
        sceneManager.toggleControls();
        cameraManager.toggleControls();
        isAnimating = true;
        window.ready = false;
        const canvas = document.getElementById('mySecondCanvas');
        canvas.style.display = 'none';
        animate();
    }
});

// Start the animation loop
function animate() {
    if (isAnimating) {
        requestAnimationFrame(animate);
        // Update rendering logic
        renderer.render(scene, camera);
    }
}



