/**
 * #35.2 - Lexicographic Order
 * */
var game;
window.onload = function () {
	const gameConfig = {
		width: 800,
		height: 800,
		resolution: 1,
		scene: [ SimpleScene ]
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
	create() {
		var vals = Phaser.Utils.Array.NumberArray(0, 2);
		var numbs = [];
		var tex = this.add.text(400, 400, vals.join(''), { font: '60px Tahoma' })
			.setOrigin(.5);
		var timer = this.time.addEvent({
			delay: 500,
			loop: true,
			callbackScope: this,
			callback: () => {
				console.log(vals);
				// STEP 1
				var largestI = -1;
				for (var i = 0; i < vals.length - 1; i++) {
					if (vals[i] < vals[i + 1]) {
						largestI = i;
					}
				}
				if(largestI === -1) {
					timer.remove();
				}
				// STEP 2
				var largestJ = -1;
				for (var j = 0; j < vals.length; j++) {
					if (vals[largestI] < vals[j]) {
						largestJ = j;
					}
				}
				// STEP 3
				this.swap(vals, largestI, largestJ);
				// STEP 4
				var endArray = (vals.splice(largestI + 1)).reverse();
				vals = vals.concat(endArray);
				numbs.push(vals.join(''));

				tex.setText(numbs.sort());
			}
		});
	}
	swap(a, i, j) {
		var temp = a[i];
		a[i] = a[j];
		a[j] = temp;
	}
}
