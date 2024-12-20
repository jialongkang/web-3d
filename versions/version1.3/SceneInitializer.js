import Object from './objClass.js';
import {Sphere} from './objClass.js';
import {Cube} from './objClass.js';

export default class SceneInitializer {
    constructor() {
        this.scene = new THREE.Scene();
        this.objects = []; // Store all objects
        this.camera = null; // Initialize camera
        this.renderer = null; // Initialize renderer
        this.previous_selection = null;
        this.selection = null; // Currently selected object
        this.raycaster = new THREE.Raycaster(); // New raycaster for selection
        this.mouse = new THREE.Vector2(); // New mouse vector
    }

    init() {
        this.createGrid();
        this.createAxes();
        this.setupCamera(); // New method to set up the camera
        this.setupRenderer(); // New method to set up the renderer

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('keydown', (event) => this.handleKeyPress(event), false);
        window.addEventListener('click', (event) => this.onMouseClick(event), false); // Add click event listener
    }

    createGrid() {
        const gridHelper = new THREE.GridHelper(100, 100, 0x808080, 0x808080);
        this.scene.add(gridHelper);
    }

    createAxes() {
        const axesHelper = new THREE.AxesHelper(100);
        this.scene.add(axesHelper);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 5); // Set the camera position
        this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the origin
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x404040);
        document.body.appendChild(this.renderer.domElement);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    handleKeyPress(event) {
        if (event.key === 'c') { // Check if the "C" key is pressed
            this.createCube();
        }
        if (event.key == 'v') {
            this.createSphere();
        }
    }

    addObject(object) {
        this.objects.push(object); // Adds the entire object class to list
        this.scene.add(object.obj); // Adds mesh to scene
        this.scene.add(object.outline);
    }

    createCube () {
        const cube = new Cube(3);
        this.addObject(cube);
    }

    createSphere () {
        const sphere = new Sphere(1.5);
        this.addObject(sphere);
    }

    onMouseClick(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.objects.map(obj => obj.obj)); // No mapping needed
        if (intersects.length > 0) {
            // Find the corresponding class object based on the intersected mesh
            this.selection = this.objects.find(obj => obj.obj === intersects[0].object); // Store the entire class object
            this.editSelectedObject(); // Call method to edit the selected object
        }
    }

    editSelectedObject() {
        if (this.previous_selection == this.selection) return;
        if (this.previous_selection) {
            this.selection.selected = true; // Select the current object
            this.selection.outline_mat.color.set(0xffa500); // Change color to orange
            this.previous_selection.selected = false;
            this.previous_selection.outline_mat.color.set(0xA0A0A0);
        } else {
            this.selection.selected = true; // Select the current object
            this.selection.outline_mat.color.set(0xffa500); // Change color to orange
        }
        this.previous_selection = this.selection;
    }
}