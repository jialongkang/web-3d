import SceneInitializer from './SceneInitializer.js';
import CameraController from './CameraInitializer.js';
import InputHandler from './InputHandler.js';
import Object from './objClass.js';
import {Sphere} from './objClass.js';
import {Cube} from './objClass.js';

console.log("script.js is running");

const scene_class = new SceneInitializer();
scene_class.init();

// Create and add a sphere and a cube
// scene_class.createAndAddSphere(1, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
// scene_class.createAndAddCube(1, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));

let renderer = scene_class.renderer;
let camera = scene_class.camera;
let scene = scene_class.scene;

// const cube1 = new Cube(3);
// console.log(cube1);
// scene.add(cube1.mesh);

const camera_class = new CameraController(camera);

camera_class.init();
// const input_handler = new InputHandler(camera, renderer);

// Start the animation loop
function animate() {
    requestAnimationFrame(animate);
    // Update rendering logic
    renderer.render(scene, camera);
}

animate();
