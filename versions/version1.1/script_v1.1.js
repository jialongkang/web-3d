console.log("script.js is running");

let scene, camera, renderer, gridHelper, sphere;
let camera_distance;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let zoomSpeed = 0.05;
let dragSpeed = 0.05;
let rotationSpeed = 0.01;
let azimuth; // Angle around the Y-axis
let elevation; // Angle from the Y-axis
let movementMode = 'none'; // New variable to track the current movement mode

function init() {
    // Create the scene
    scene = new THREE.Scene();

    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5); // Set the camera position
    initial_lookAt = new THREE.Vector3(0, 0, 0);
    camera.lookAt(initial_lookAt);
    camera_distance = camera.position.distanceTo(initial_lookAt);
    console.log(camera_distance);
    // Calculate initial azimuth and elevation based on camera position
    azimuth = Math.atan2(camera.position.y, camera.position.x); // Calculate azimuth
    elevation = Math.acos(camera.position.z / camera_distance); // Calculate elevation

    // Set up the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x404040);
    document.body.appendChild(renderer.domElement);

    // Create the grid helper with custom colors
    const gridHelper = new THREE.GridHelper(100, 100, 0x808080, 0x808080); // Set grid lines to a different shade of grey
    const axesHelper = new THREE.AxesHelper(100); // Create axes helper for x, y, z axes
    scene.add(gridHelper); // Add grid to the scene
    scene.add(axesHelper); // Add axes to the scene

    // Create a simple cube object
    const cubeGeometry = new THREE.BoxGeometry(3, 3, 3); // Cube geometry
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Change cube color to background color
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial); // Create cube mesh
    scene.add(cube); // Add cube to the scene

    // Create an outline for the cube
    const cubeOutlineMaterial = new THREE.LineBasicMaterial({ color: 0xffa500 }); // Orange color for the outline
    const cubeOutlineGeometry = new THREE.EdgesGeometry(cubeGeometry); // Create edges geometry from the cube geometry
    const cubeOutline = new THREE.LineSegments(cubeOutlineGeometry, cubeOutlineMaterial); // Create line segments for the outline
    scene.add(cubeOutline); // Add the outline to the scene

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Mouse events
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('wheel', onMouseWheel, false);

    // Start the animation loop
    animate();
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };

    const isCommandPressed = event.metaKey; // Check if command key is pressed
    if (isCommandPressed) {
        movementMode = 'rotate'; // Set movement mode to rotate
    } else {
        movementMode = 'move'; // Set movement mode to move
    }
}

function onMouseUp() {
    isDragging = false;
    movementMode = 'none'; // Reset movement mode on mouse up
}

function onCommandKey() {
    
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    if (movementMode === 'rotate') { // Only execute rotation logic if in rotate mode
        azimuth += deltaX * rotationSpeed; // Rotate around the Y-axis
        elevation -= deltaY * rotationSpeed; // Rotate around the X-axis

        // Clamp elevation to prevent flipping over
        elevation = Math.max(0.1, Math.min(Math.PI - 0.1, elevation));

        // Get the current world direction
        const w = new THREE.Vector3();
        camera.getWorldDirection(w);
        const scaled_w = new THREE.Vector3(w.x * camera_distance, w.y * camera_distance, w.z * camera_distance);
        cam_clone = camera.position.clone();
        const viewpoint = cam_clone.addVectors(cam_clone, scaled_w);
        const radius = camera.position.distanceTo(viewpoint);

        // Calculate new camera position using spherical coordinates
        camera.position.x = viewpoint.x + radius * Math.sin(elevation) * Math.cos(azimuth);
        camera.position.y = viewpoint.y + radius * Math.cos(elevation);
        camera.position.z = viewpoint.z + radius * Math.sin(elevation) * Math.sin(azimuth);

        camera.lookAt(new THREE.Vector3(viewpoint.x, viewpoint.y, viewpoint.z));
    } else if (movementMode === 'move') { // Only execute movement logic if in move mode
        const w = new THREE.Vector3();
        camera.getWorldDirection(w).normalize();
        
        const up = new THREE.Vector3(0, 1, 0);
        const u = new THREE.Vector3().crossVectors(up, w).normalize();
        const v = new THREE.Vector3().crossVectors(w, u).normalize();
        
        camera.position.addScaledVector(u, deltaX * dragSpeed); // Move right/left
        camera.position.addScaledVector(v, deltaY * dragSpeed); // Move up/down
    }

    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseWheel(event) {
    if (movementMode === 'none') { // Only execute zoom logic if no other mode is active
        const w = new THREE.Vector3();
        camera.getWorldDirection(w); // Get the direction the camera is facing
        w.normalize(); // Normalize the direction vector
        camera.position.addScaledVector(w, -event.deltaY * zoomSpeed); // Move camera along the zoom direction
        camera_distance += event.deltaY * zoomSpeed;
        console.log(camera_distance);
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the sphere for demonstration
    // sphere.rotation.x += 0.01;
    // sphere.rotation.y += 0.01;
    // sphere.position.y += getRandomFloat(-0.1, 0.1);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


// Initialize the scene
init();
