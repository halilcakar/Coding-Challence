/**
 * #6 - Mitosis Simulation
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
		super({key: 'SimpleScene'});
	}
	create() {
		this.cells = [];
		this.cells.push(new Cell(this));
		this.cells.push(new Cell(this));
	}
	update() {
		for (let i = 0; i < this.cells.length; i++) {
			const cell = this.cells[i];
			cell.update();
		}
	}
}

class Cell extends Phaser.GameObjects.Graphics {
	constructor(scene, x, y, r, c) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;
		this.config = scene.game.config;
		this.x = x || random(40, 570);
		this.y = y || random(40, 370);
		this.r = r || 60;
		this.c = c || new Phaser.Display.Color(random(100, 255), 0, random(100, 255));
		this.area = new Phaser.Geom.Rectangle(this.x, this.y, 3, 3);
		this.draw();
	}
	draw() {
		this.setDefaultStyles({
			fillStyle: { color: this.c.color, alpha: 1 }
		});
		this.fillCircle(0, 0, this.r);
		this.setInteractive(
			new Phaser.Geom.Circle(0, 0, this.r),
			Phaser.Geom.Circle.Contains
		);
		this.on('pointerdown', function () {
			this.scene.cells.push(
				new Cell(this.scene, this.x + random(-10, 10),
					this.y + random(-10, 10), this.r / 2 , this.c)
			);
			this.scene.cells.push(
				new Cell(this.scene, this.x + random(-10, 10),
					this.y + random(-10, 10), this.r / 2 , this.c)
			);
			this.destroy();
		});
	}
	update() {
		let point = this.area.getRandomPoint();
		this.setPosition(point.x, point.y);

		this.r += .01;
		if(this.r > 60) {
			this.r = 60;
		}
		this.clear();
		this.fillCircle(0, 0, this.r);
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
