/**
 * #4 - Purple Rain
 * */
var game;
window.onload = function() {
	const gameConfig = {
		width: 600,
		height: 400,
		backgroundColor: 0xE6E6FA,
		resolution: 1,
		scene: [ SimpleScene ]
	};
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame();
	window.addEventListener('resize', resizeGame);
};

class SimpleScene extends Phaser.Scene {
	constructor() {
		super();
	}
	create() {
		this.drops = [];
		for (let i = 0; i < 500; i++) {
			this.drops.push(new Drop(this));
		}
	}
	update() {
		if(this.drops.length) {
			this.drops.forEach(function (ch) {
				ch.update();
			});
		}
	}
}

class Drop extends Phaser.GameObjects.Graphics {
	constructor(scene) {
		super(scene, {
			x: Phaser.Math.RND.integerInRange(5, scene.game.config.width),
			y: Phaser.Math.RND.integerInRange(-500, 500)
		});
		this.z = Phaser.Math.RND.integerInRange(0, 20);
		this.len = map(this.z, 0, 20, 10, 20);
		this.yspeed = map(this.z, 0, 20, 1, 10);
		scene.add.existing(this);
		this.draw();
	}
	draw() {
		this.clear();
		let thick = map(this.z, 0, 20, 1, 3);
		this.lineStyle(thick, 0x8A2BE2);
		this.beginPath();
		this.moveTo(0, 0);
		this.lineTo(0, this.len);
		this.strokePath();
	}
	update() {
		this.y += this.yspeed;
		let grav = map(this.z, 0, 20, 0, .2);
		this.y += grav;
		if(this.y > this.scene.game.config.height) {
			this.y = Phaser.Math.RND.integerInRange(-100, 100);
			this.yspeed = map(this.z, 0, 20, 4, 10);
		}
	}
}

const resizeGame = () => {
	var canvas = document.querySelector('canvas');
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	var windowRatio = windowWidth / windowHeight;
	var gameRatio = game.config.width / game.config.height;
	if (windowRatio < gameRatio) {
		canvas.style.width = windowWidth + 'px';
		canvas.style.height = (windowWidth / gameRatio) + 'px';
	} else {
		canvas.style.width = (windowHeight * gameRatio) + 'px';
		canvas.style.height = windowHeight + 'px';
	}
};
