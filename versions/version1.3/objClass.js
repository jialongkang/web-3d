export default class Object {
    constructor() {
        this.obj = null;
        this.material = null;
        this.outline = null;
        this.selected = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            console.log(`Selected State: ${this.selected}`);
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
                this.obj.position.y += 1;
                break;
            case 'down':
                this.obj.position.y -= 1;
                break;
            case 'left':
                this.obj.position.x -= 1;
                break;
            case 'right':
                this.obj.position.x += 1;
                break;
            case 'forward':
                this.obj.position.z += 1;
                break;
            case 'backward':
                this.obj.position.z -= 1;
                break;
        }
        this.updateOutline();
    }

    updateOutline () {
        this.outline.position.copy(this.obj.position);
    }
}

export class Sphere extends Object {
    constructor(radius) {
        super();
        this.geometry = new THREE.SphereGeometry(radius, 32, 16);
        this.material = new THREE.MeshBasicMaterial({ color: 0x808080 });
        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.outline_mat = new THREE.LineBasicMaterial({ color: 0xA0A0A0 });
        this.outline_geom = new THREE.EdgesGeometry(this.geometry);
        this.outline = new THREE.LineSegments(this.outline_geom, this.outline_mat);
        console.log(this.outline);
    }
}

export class Cube extends Object {
    constructor(size) {
        super();
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshBasicMaterial({ color: 0x808080 });
        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.outline_mat = new THREE.LineBasicMaterial({ color: 0xA0A0A0 })
        this.outline_geom = new THREE.EdgesGeometry(this.geometry);
        this.outline = new THREE.LineSegments(this.outline_geom, this.outline_mat);
        console.log(this.outline);
    }
}