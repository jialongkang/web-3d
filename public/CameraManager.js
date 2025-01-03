export default class CameraManager {
    constructor(cam) {
        this.camera = cam;
        this.camera_distance = 0;
        this.azimuth = 0;
        this.elevation = 0;
        this.rotationSpeed = 0.01;
        this.dragSpeed = 0.05;
        this.zoomSpeed = 0.05;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.movementMode = 'none';
        this.controlsEnabled = false;
    }

    init() {
        this.camera_distance = this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
        this.azimuth = Math.atan2(this.camera.position.y, this.camera.position.x);
        this.elevation = Math.acos(this.camera.position.z / this.camera_distance);

        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) { // Check if the left mouse button is clicked
                this.onMouseDown(event);
            }
        }, false);
        window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('wheel', this.onMouseWheel.bind(this), false);    
    }

    toggleControls() {
        this.controlsEnabled = !this.controlsEnabled;
    }

    onMouseDown(event) {
        const menuCanvas = document.getElementById('menuCanvas');
        const isClickInsideMenu = menuCanvas.contains(event.target); // Update the variable
        if (isClickInsideMenu) return;
        if (!this.controlsEnabled) return;
        this.isDragging = true;
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    
        const isCommandPressed = event.metaKey; // Check if command key is pressed
        this.movementMode = isCommandPressed ? 'rotate' : 'move'; // Set movement mode to rotate or move
    }
    
    onMouseUp() {
        if (!this.controlsEnabled) return;
        this.isDragging = false;
        this.movementMode = 'none'; // Reset movement mode on mouse up
    }
    
    onMouseMove(event) {
        if (!this.controlsEnabled) return;
        if (!this.isDragging) return;
    
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;
    
        if (this.movementMode === 'rotate') { // Only execute rotation logic if in rotate mode
            this.azimuth += deltaX * this.rotationSpeed; // Rotate around the Y-axis
            this.elevation -= deltaY * this.rotationSpeed; // Rotate around the X-axis
    
            // Clamp elevation to prevent flipping over
            this.elevation = Math.max(0.1, Math.min(Math.PI - 0.1, this.elevation));
    
            // Get the current world direction
            const viewpoint = this.calculateLookAt(); 
            const radius = this.camera.position.distanceTo(viewpoint);
            
            // Calculate new camera position using spherical coordinates
            this.camera.position.x = viewpoint.x + radius * Math.sin(this.elevation) * Math.cos(this.azimuth);
            this.camera.position.y = viewpoint.y + radius * Math.cos(this.elevation);
            this.camera.position.z = viewpoint.z + radius * Math.sin(this.elevation) * Math.sin(this.azimuth);
    
            this.camera.lookAt(new THREE.Vector3(viewpoint.x, viewpoint.y, viewpoint.z));
        } else if (this.movementMode === 'move') { // Only execute movement logic if in move mode
            const w = new THREE.Vector3();
            this.camera.getWorldDirection(w).normalize();
            
            const up = new THREE.Vector3(0, 1, 0);
            const u = new THREE.Vector3().crossVectors(up, w).normalize();
            const v = new THREE.Vector3().crossVectors(w, u).normalize();
            
            this.camera.position.addScaledVector(u, deltaX * this.dragSpeed); // Move right/left
            this.camera.position.addScaledVector(v, deltaY * this.dragSpeed); // Move up/down
        }
    
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }
    
    onMouseWheel(event) {
        if (!this.controlsEnabled) return;
        if (this.movementMode === 'none') { // Only execute zoom logic if no other mode is active
            const w = new THREE.Vector3();
            this.camera.getWorldDirection(w); // Get the direction the camera is facing
            w.normalize(); // Normalize the direction vector
            this.camera.position.addScaledVector(w, -event.deltaY * this.zoomSpeed); // Move camera along the zoom direction
            this.camera_distance += event.deltaY * this.zoomSpeed;
            // console.log(this.camera_distance);
        }
    }
    
    calculateLookAt() {
        const w = new THREE.Vector3();
        this.camera.getWorldDirection(w);
        const scaled_w = new THREE.Vector3(w.x * this.camera_distance, w.y * this.camera_distance, w.z * this.camera_distance);
        const cam_clone = this.camera.position.clone();
        const viewpoint = cam_clone.addVectors(cam_clone, scaled_w);
        return viewpoint;
    }

    // Additional methods for mouse down, up, and wheel events can be added here
}