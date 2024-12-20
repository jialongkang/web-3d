import onWindowResize from './Functions.js';

export default class InputHandler {
    constructor(cam, rend) {
        this.camera = cam;
        this.renderer = rend;
        this.movementMode = 'none';
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.initEvents();
    }

    initEvents() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
        // window.addEventListener('mousedown', onMouseDown, false);
        // window.addEventListener('mouseup', onMouseUp, false);
        // window.addEventListener('mousemove', onMouseMove, false);
        // window.addEventListener('wheel', onMouseWheel, false);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    

    // onMouseDown(event) {
    //     this.isDragging = true;
    //     this.previousMousePosition = { x: event.clientX, y: event.clientY };
    //     this.movementMode = event.metaKey ? 'rotate' : 'move';
    // }

    // onMouseUp() {
    //     this.isDragging = false;
    //     this.movementMode = 'none';
    // }

    // onMouseMove(event) {
    //     // Handle mouse movement logic
    // }

    // onKeyDown(event) {
    //     // Handle keyboard input for cube movement
    // }
}