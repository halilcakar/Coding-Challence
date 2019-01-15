/**
 * #30 - Phyllotaxis
 * */
var game;
window.onload = function() {
	const gameConfig = {
		width: 400,
		height: 400,
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
		this.n = 0;
		this.c = 3;
		this.angle = 137.6;
		//137.3
		//137.6
		this.grap = this.add.graphics();

	}
	update() {
		if(this.n < this.game.config.width * 2) {
			let a = this.n * this.angle;
			let r = this.c * Math.sqrt(this.n);
			let x = r * Math.cos(a) + this.game.config.width / 2;
			let y = r * Math.sin(a) + this.game.config.height / 2;
			this.grap.fillStyle(new Phaser.Display.Color.RandomRGB(100, 255).color, 1);
			this.grap.fillCircle(x, y, 2, 2);
			this.n++;
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
