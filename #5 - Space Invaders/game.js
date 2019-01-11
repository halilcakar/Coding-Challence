/**
 * #5 - Space Invaders
 * */
let game;
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

	}
	update() {

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
