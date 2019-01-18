/**
 * #69.1 - Evolutionary Steering Behaviors
 * */
var game;
window.onload = function () {
	const gameConfig = {
		width: 800,
		height: 800,
		resolution: 1,
		scene: [SimpleScene]
	};
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame(game);
	window.addEventListener('resize', () => { resizeGame(game) });
};

class SimpleScene extends Phaser.Scene {
	constructor() {
		super();
	}
	init() {
        this.grap = this.add.graphics()
        .setDefaultStyles({
            fillStyle: { color: 0xFFFFFF, alpha: 1 },
            lineStyle: { color: 0xFFFFFF, alpha: 1, width: 2 }
        }).fillTriangle(0, 32, 8,0,16,32)
        .generateTexture('vehicle', 32,32)
        .destroy();

	}
	create() {
        new Vehicle(this, 250, 250);

	}
}

class Vehicle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'vehicle');

        this.acceleration = new Phaser.Math.Vector2();
        this.velocity  = random2D();
        this.position = new Phaser.Math.Vector2(x, y);

        console.log(this);

        scene.add.existing(this);
    }
}



