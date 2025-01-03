import Object from './Objects.js';
import {Sphere} from './Objects.js';
import {Cube} from './Objects.js';

export default class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.objects = []; // Store all objects
        this.camera = null; // Initialize camera
        this.renderer = null; // Initialize renderer
        this.previous_selection = null;
        this.selection = null; // Currently selected object
        this.raycaster = new THREE.Raycaster(); // New raycaster for selection
        this.mouse = new THREE.Vector2(); // New mouse vector
        this.objects_info_list = [];
        this.controlsEnabled = false; // Add controlsEnabled property
        this.img_w = 1000;
        this.img_ar1 = 16.0;
        this.img_ar2 = 9.0;
        this.img_vfov = 75;
        this.img_spp = 10;
        this.menu_click = false;
        this.obj_index = 1;
        this.radius = null;
        this.size = null;
        this.cursorInInput = false;
        this.moveX = false;
    }

    init() {
        this.createGrid();
        this.createAxes();
        this.setupCamera(); // New method to set up the camera
        this.setupRenderer(); // New method to set up the renderer

        // Add event listener for material type change
        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('keydown', (event) => this.handleKeyPress(event), false);
        window.addEventListener('click', (event) => this.onMouseClick(event), false); // Add click event listener
        
        document.getElementById('materialType').addEventListener('change', () => this.updateMenu(false));
        document.getElementById('objectType').addEventListener('change', () => this.updateAddMenu());
        document.getElementById('addObjectButton').addEventListener('click', () => this.addObjectFromMenu());
        document.getElementById('deleteButton').addEventListener('click', () => this.deleteSelectedObject());
        this.setupInputListeners();
        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
                input.addEventListener('focus', () => {
                // console.log('Cursor is inside the input box.');
                this.cursorInInput = true;
            });
            input.addEventListener('blur', () => {
                this.cursorInInput = false;
                // console.log('Cursor is outside the input box.');
              });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key == 's') {
                console.log(this.moveX);
                if (this.moveX) {
                    this.moveX = false;
                    this.updateText(18,55,'+z','blue');
                    this.updateText(70,55,'-z','blue');
                } else {
                    this.moveX = true;
                    this.updateText(18,55,'-x','red');
                    this.updateText(70,55,'+x','red');
                }
            }
        })
    }

    setupInputListeners() {
        const handleInputChange = (inputId, updateFunction) => {
            document.getElementById(inputId).addEventListener('input', () => {
                const newValue = parseFloat(document.getElementById(inputId).value);
                if (!isNaN(newValue)) { // Check for valid number and selection
                    updateFunction(newValue);
                }
            });
        };

        // Add button setting inputs
        handleInputChange('addSphere_radius', (value) => {
            this.radius = value;
            document.getElementById("addObjectButton").disabled = false;
        }) 
        handleInputChange('addCube_size', (value) => {
            this.size = value;
            document.getElementById("addObjectButton").disabled = false;
        }) 

        // Image setting inputs
        handleInputChange('img_w', (value) => {
            this.img_w = value;
        });
        handleInputChange('img_ar1', (value) => {
            this.img_ar1 = value;
        });
        handleInputChange('img_ar2', (value) => {
            this.img_ar2 = value;
        });
        handleInputChange('img_spp', (value) => {
            this.img_spp = value;
        });

        // Position inputs
        handleInputChange('xPosition', (value) => {
            if (this.selection) {
                this.selection.mesh.position.x = value; // Update X position
                this.selection.updateOutline();
            }
        });
        handleInputChange('yPosition', (value) => {
            if (this.selection) {
                this.selection.mesh.position.y = value; // Update Y position
                this.selection.updateOutline();
            }
        });
        handleInputChange('zPosition', (value) => {
            if (this.selection) {
                this.selection.mesh.position.z = value; // Update Z position
                this.selection.updateOutline();
            }
        });

        // Cube parameter input
        handleInputChange('cubeParam', (value) => {
            if (this.selection && this.selection.type === 'cube') {
                const currPosition = this.selection.mesh.position;
                this.deleteSelectedObject();
                this.createCube(value, currPosition);
                this.editSelection();
                this.updateMenu();
            }
        });

        // Sphere parameter input
        handleInputChange('sphereParam', (value) => {
            if (this.selection && this.selection.type === 'sphere') {
                const currPosition = this.selection.mesh.position;
                this.deleteSelectedObject();
                this.createSphere(value, currPosition);
                this.editSelection();
                this.updateMenu();
            }
        });

        // New function to update dielectric parameters at once
        const updateDielectricParams = () => {
            const materialType = document.getElementById('materialType').value;
            if (this.selection && materialType === 'dielectric') { 
                const RI = parseFloat(document.getElementById('dielectric_param_1').value); // Get dielectric param
                if (!isNaN(RI)) { // Check if the value is a valid number
                    this.selection.rtmaterial_type = materialType;
                    this.selection.rtmaterial_params = [RI]; // Update dielectric params
                }
            }
        };

        // New function to update metal parameters at once
        const updateMetalParams = () => {
            const materialType = document.getElementById('materialType').value;
            if (this.selection && materialType === 'metal') { 
                const R = parseFloat(document.getElementById('metal_param_1').value); // Get metal color R
                const G = parseFloat(document.getElementById('metal_param_2').value); // Get metal color G
                const B = parseFloat(document.getElementById('metal_param_3').value); // Get metal color B
                const fuzz = parseFloat(document.getElementById('metal_param_4').value); // Get metal fuzz
                if (!isNaN(R) && !isNaN(G) && !isNaN(B) && !isNaN(fuzz)) { // Check if all values are valid numbers
                    this.selection.rtmaterial_type = materialType;
                    this.selection.rtmaterial_params = [R, G, B, fuzz]; // Update metal params
                }
            }
        };

        // New function to update lambertian parameters at once
        const updateLambertianParams = () => {
            const materialType = document.getElementById('materialType').value;
            if (this.selection && materialType === 'lambertian') { 
                const R = parseFloat(document.getElementById('lamb_param_1').value); // Get lambertian color R
                const G = parseFloat(document.getElementById('lamb_param_2').value); // Get lambertian color G
                const B = parseFloat(document.getElementById('lamb_param_3').value); // Get lambertian color B
                if (!isNaN(R) && !isNaN(G) && !isNaN(B)) { // Check if all values are valid numbers
                    this.selection.rtmaterial_type = materialType;
                    this.selection.rtmaterial_params = [R, G, B]; // Update lambertian params
                }
            }
        };

        handleInputChange('dielectric_param_1', updateDielectricParams);
        handleInputChange('metal_param_1', updateMetalParams);
        handleInputChange('metal_param_2', updateMetalParams);
        handleInputChange('metal_param_3', updateMetalParams);
        handleInputChange('metal_param_4', updateMetalParams);
        handleInputChange('lamb_param_1', updateLambertianParams);
        handleInputChange('lamb_param_2', updateLambertianParams);
        handleInputChange('lamb_param_3', updateLambertianParams);
    
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
        if (!this.controlsEnabled) return; // Check if controls are enabled
        if (event.key === 'c') { // Check if the "C" key is pressed
            this.createCube(3); // Default cube size
        }
        if (event.key === 'v') {
            this.createSphere(1.5); // Default sphere size
        }
        if (event.key === 'd') { // Check if the "Delete" key is pressed
            this.deleteSelectedObject(); // Call method to delete the selected object
        }
        if (event.key === 'p') {
            this.updateObjectsInfoList();
            console.log(this.objects_info_list);
        }
    }

    updateObjectsInfoList() {
        this.objects_info_list = this.objects.map(object => [
            object.type,
            object.mesh.position.x,
            object.mesh.position.y,
            object.mesh.position.z,
            object.type === 'sphere' ? object.radius : object.type === 'cube' ? object.size : null,
            object.rtmaterial_type,
            object.rtmaterial_params,
        ]);
    }

    addObjectFromMenu() {
        const objectType = document.getElementById('objectType').value;
        if (objectType == 'cube') {
            this.createCube(this.size);
        } else if (objectType == 'sphere') {
            this.createSphere(this.radius);
        }
    }

    addObject(object) {
        this.scene.add(object.mesh); // Adds object mesh to scene
        this.scene.add(object.outline); // Adds object outline to scene
        this.objects.push(object);
        this.obj_index += 1;
    }

    createCube (radius, position) {
        const cube = new Cube(radius, position, this);
        cube.index = this.obj_index;
        
        this.addObject(cube);
    }

    createSphere (size, position) {
        const sphere = new Sphere(size, position, this);
        sphere.index = this.obj_index;
        
        this.addObject(sphere);
    }

    onMouseClick(event) {
        if (!this.controlsEnabled) return; 
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects.map(obj => obj.mesh)); // No mapping needed
        
        const menuCanvas = document.getElementById('menuCanvas');
        const menuContent = document.getElementById('menuContent');
        const isClickInsideMenu = menuCanvas.contains(event.target); // Update the variable
        const controlsMenu = document.getElementById('controlsMenu');

        if (menuIcon.contains(event.target)) {
            this.updateImageSettings();
            menuContent.classList.toggle('hidden');
            document.getElementById('addObjectSettings').classList.remove('hidden');
            document.getElementById('onlyImageSettings').classList.remove('hidden');
        } 
        if (controlsIcon.contains(event.target)) {
            this.updateImageSettings();
            controlsMenu.classList.toggle('hidden');
        } 
        // if (objectTitle.contains(event.target)) {
        //     document.getElementById('objectContent').classList.toggle('hidden');
        // }

        if (intersects.length > 0) {
            this.selection = this.objects.find(obj => obj.mesh === intersects[0].object); // Store the entire class object
            this.editSelection(); // Call method to edit the selected object
            this.updateImageSettings();
            this.updateMenu(); // Update the object parameters based on selection type
            this.previous_selection = this.selection;
        } else {
            if (!isClickInsideMenu) { // Use the variable here
                this.selection = null;
                this.editSelection();
                this.hideMenu(); // Hide menu if no object is selected
            } else {
                this.editSelection()
                // this.showMenu();
            }
        }   
    }
    
    editSelection() {
        if (this.previous_selection == this.selection) return; // Selecting same object again
        if (this.previous_selection) { // If previous selection was another object, not background
            if (!this.selection) { // Selecting background from current object selection
                this.previous_selection.selected = false;
                this.previous_selection.outline_mat.color.set(0xA0A0A0);
                this.previous_selection = null;
            } else { // Changing selection between two objects
                this.selection.selected = true; // Select the current object
                this.selection.outline_mat.color.set(0xffa500); // Change color to orange
                this.previous_selection.selected = false;
                this.previous_selection.outline_mat.color.set(0xA0A0A0);
            }
        } else { // Selecting object from current background selection
            this.selection.selected = true; // Select the current object
            this.selection.outline_mat.color.set(0xffa500); // Change color to orange
        }
    }

    updateImageSettings() {
        // Update image settings with current values
        document.getElementById('img_w').value = this.img_w;
        document.getElementById('img_ar1').value = this.img_ar1;
        document.getElementById('img_ar2').value = this.img_ar2;
        document.getElementById('img_spp').value = this.img_spp;
    }


    updateMenu(isNew = true) {
        document.getElementById('addObjectSettings').classList.remove('hidden');
        document.getElementById('onlyImageSettings').classList.remove('hidden');
        const menuContent = document.getElementById('menuContent');
        const objectContent = document.getElementById('objectContent'); // Get the menu block
        const sections = objectContent.children; // Get all child elements of menuContent
        menuContent.classList.remove('hidden');
        objectContent.classList.remove('hidden'); // Show the menu content
        // Loop through all sections and make them visible
        for (let section of sections) {
            section.classList.remove('hidden');
            section.classList.add('visible'); // Add the visible class to each section
        }

        // Update the dynamic title
        const objectType = this.selection.type; // Get the object type
        const buttonType = document.getElementById('materialType').value;
        const materialType = this.selection.rtmaterial_type;
        // const objectIndex = this.selection.index; // Get the object index

        // Update position boxes with current values.
        document.getElementById('xPosition').value = this.selection.mesh.position.x; // Update X position
        document.getElementById('yPosition').value = this.selection.mesh.position.y; // Update Y position
        document.getElementById('zPosition').value = this.selection.mesh.position.z; // Update Z position
        
        // Update object parameter section with current values.
        const cubeParams = document.getElementById('cubeParams');
        const sphereParams = document.getElementById('sphereParams');
        cubeParams.style.display = 'none';
        sphereParams.style.display = 'none';

        if (objectType == 'cube') {
            document.getElementById('objectTitle').innerText = `Obj #${this.selection.index}: Cube`;
            cubeParams.style.display = 'block';
            document.getElementById('cubeParam').value = this.selection.size;
        } else if (objectType == 'sphere') {
            document.getElementById('objectTitle').innerText = `Obj #${this.selection.index}: Sphere`;
            sphereParams.style.display = 'block';
            document.getElementById('sphereParam').value = this.selection.radius; 
        }
    
        // Update material parameter section with current values
        const dielectricParams = document.getElementById('dielectricParams');
        const metalParams = document.getElementById('metalParams');
        const lambertianParams = document.getElementById('lambertianParams');
        dielectricParams.style.display = 'none';
        metalParams.style.display = 'none';
        lambertianParams.style.display = 'none';
        
        if (isNew) {
            this.clearMenuInputs();
            document.getElementById('materialType').value = materialType;
            if (materialType === 'dielectric') {
                dielectricParams.style.display = 'block';
                document.getElementById('dielectric_param_1').value = this.selection.rtmaterial_params[0];
            } else if (materialType === 'metal') {
                metalParams.style.display = 'block';
                document.getElementById('metal_param_1').value = this.selection.rtmaterial_params[0];
                document.getElementById('metal_param_2').value = this.selection.rtmaterial_params[1];
                document.getElementById('metal_param_3').value = this.selection.rtmaterial_params[2];
                document.getElementById('metal_param_4').value = this.selection.rtmaterial_params[3];
            } else if (materialType === 'lambertian') {
                lambertianParams.style.display = 'block';
                document.getElementById('lamb_param_1').value = this.selection.rtmaterial_params[0];
                document.getElementById('lamb_param_2').value = this.selection.rtmaterial_params[1];
                document.getElementById('lamb_param_3').value = this.selection.rtmaterial_params[2];
            }
        } else {
            if (buttonType === 'dielectric') {
                dielectricParams.style.display = 'block';
            } else if (buttonType === 'metal') {
                metalParams.style.display = 'block';
            } else if (buttonType === 'lambertian') {
                lambertianParams.style.display = 'block';
            }
        }
    }

    updateAddMenu() {
        const addShapeType = document.getElementById('objectType').value;
        const addCubeParams = document.getElementById('addCubeParams');
        const addSphereParams = document.getElementById('addSphereParams');
        const addObjectButton = document.getElementById('addObjectButton');
        addObjectButton.disabled = true;
        addCubeParams.style.display = 'none';
        addSphereParams.style.display = 'none';
        document.getElementById('addSphere_radius').value = '';
        document.getElementById('addCube_size').value = '';
        this.size = null;
        this.radius = null;
        if (addShapeType == 'cube') {
            addCubeParams.style.display = 'block';
        }
        else if (addShapeType == 'sphere') {
            addSphereParams.style.display = 'block';
        }
    }

    clearMenuInputs() {
        document.getElementById('dielectric_param_1').value = '';
        document.getElementById('metal_param_1').value = '';
        document.getElementById('metal_param_2').value = '';
        document.getElementById('metal_param_3').value = '';
        document.getElementById('metal_param_4').value = '';
        document.getElementById('lamb_param_1').value = '';
        document.getElementById('lamb_param_2').value = '';
        document.getElementById('lamb_param_3').value = '';
    }

    hideMenu() {
        const menuContent = document.getElementById('menuContent');
        const objectContent = document.getElementById('objectContent');
        menuContent.classList.add('hidden');
        objectContent.classList.add('hidden');
        document.getElementById('objectType').value = '';
        this.updateAddMenu();
    }

    deleteSelectedObject() {
        if (this.selection) {
            this.scene.remove(this.selection.mesh); // Remove the object from the scene
            this.scene.remove(this.selection.outline); // Remove the outline from the scene
            this.objects = this.objects.filter(obj => obj !== this.selection); // Remove from the objects list
            this.selection = null; // Clear the selection
            this.hideMenu();
        }
    }

    toggleControls() {
        this.controlsEnabled = !this.controlsEnabled;
    }

    showMenu() {
        const menuContent = document.getElementById('menuContent');
        menuContent.classList.remove('hidden');
        menuContent.classList.add('visible');
    }

    updateText(x, y, newText, newColor) {
        // Select all text elements within the SVG
        const texts = document.querySelectorAll('svg text');
        
        // Iterate through each text element
        texts.forEach(text => {
            // Check if the text element's x and y attributes match the provided coordinates
            if (parseFloat(text.getAttribute('x')) === x && parseFloat(text.getAttribute('y')) === y) {
                // Update the text content
                text.textContent = newText;
                text.setAttribute('fill', newColor);
            }
        });
    }

    readyRaytracing(lookAt) {
        window.img_w = this.img_w;
        window.img_ar = this.img_ar1/this.img_ar2;
        window.img_vfov = this.img_vfov;
        window.img_spp = this.img_spp;
        window.cam_x = this.camera.position.x;
        window.cam_y = this.camera.position.y;
        window.cam_z = this.camera.position.z;
        window.lookAt_x = lookAt.x;
        window.lookAt_y = lookAt.y;
        window.lookAt_z = lookAt.z;
        this.updateObjectsInfoList();
        window.objects_info = this.objects_info_list 
    }
}