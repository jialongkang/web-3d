export default class Object {
    constructor(sceneManager) {
        this.mesh = null;
        this.material = null;
        this.outline = null;
        this.selected = false;
        this.type = null;
        this.index = null;
        this.rtmaterial_type = "lambertian";
        this.rtmaterial_params = [
            parseFloat(Math.random().toFixed(2)),
            parseFloat(Math.random().toFixed(2)),
            parseFloat(Math.random().toFixed(2))
          ];
        this.sceneManager = sceneManager;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (!this.selected) return;

            const directionMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                'w': 'forward',
                's': 'backward'
            };

            const direction = directionMap[event.key];
            if (direction) {
                this.move(direction);
                // updateCubeOutline();
            }
        });
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.mesh.position.y += 1;
                break;
            case 'down':
                this.mesh.position.y -= 1;
                break;
            case 'left':
                this.mesh.position.x -= 1;
                break;
            case 'right':
                this.mesh.position.x += 1;
                break;
            case 'forward':
                this.mesh.position.z += 1;
                break;
            case 'backward':
                this.mesh.position.z -= 1;
                break;
        }
        this.updateOutline();
        this.sceneManager.updateMenu();
    }

    updateOutline() {
        this.outline.position.copy(this.mesh.position);
    }
}

export class Sphere extends Object {
    constructor(radius, position = new THREE.Vector3(0, 0, 0), sceneManager) {
        super(sceneManager);
        this.type = "sphere";
        this.radius = radius;
        this.geometry = new THREE.SphereGeometry(radius, 32, 16);
        this.material = new THREE.MeshBasicMaterial({ color: 0x808080 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(position);
        this.outline_mat = new THREE.LineBasicMaterial({ color: 0xA0A0A0 });
        this.outline_geom = new THREE.EdgesGeometry(this.geometry);
        this.outline = new THREE.LineSegments(this.outline_geom, this.outline_mat);
        this.outline.position.copy(position);
    }
}

export class Cube extends Object {
    constructor(size, position = new THREE.Vector3(0, 0, 0), sceneManager) {
        super(sceneManager);
        this.type = "cube";
        this.size = size;
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshBasicMaterial({ color: 0x808080 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(position);
        this.outline_mat = new THREE.LineBasicMaterial({ color: 0xA0A0A0 });
        this.outline_geom = new THREE.EdgesGeometry(this.geometry);
        this.outline = new THREE.LineSegments(this.outline_geom, this.outline_mat);
        this.outline.position.copy(position);
    }
}