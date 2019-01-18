//p5js map function
const map = (n, start1, stop1, start2, stop2, withinBounds)=> {
	var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	if (!withinBounds) { return newval; }
	if (start2 < stop2) {
		return Math.max(Math.min(newval, start2), stop2);
	}
	else {
		return Math.max(Math.min(newval, stop2), start2);
	}
};

const random = (min, max) => {
	var rand = Math.random();
	if (typeof min === 'undefined') { min = 0; }
	if (typeof max === 'undefined') { max = min; min = 0; }
	return rand * (max - min) + min;
};

const resizeGame = (_game) => {
	const canvas = document.querySelector('canvas');
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;
	const windowRatio = windowWidth / windowHeight;
	const gameRatio = _game.config.width / _game.config.height;
	if (windowRatio < gameRatio) {
		canvas.style.width = windowWidth + 'px';
		canvas.style.height = (windowWidth / gameRatio) + 'px';
	}
	else {
		canvas.style.width = (windowHeight * gameRatio) + 'px';
		canvas.style.height = windowHeight + 'px';
	}
};

const random2D = () => {
	let angle = Math.random() * (2 * Math.PI);
	return new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
};