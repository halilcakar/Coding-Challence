/**
 * #35.3 - Traveling Salesperson with Lexicographic Order
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
	create() {
		this.order = [];
		this.cities = [];
		this.totalCities = 7;
		this.recordDistance = Number.MAX_VALUE;
		this.bestEver = undefined;

		this.counter = 0;
		this.totalPermutation = Phaser.Math.Factorial(this.totalCities);

		this.grap = this.add.graphics();
		this.grap.setDefaultStyles({
			fillStyle: { color: 0xFFFFFF, alpha: 1 },
			lineStyle: { color: 0xFFFFFF, alpha: 1, width: 2 }
		});

		this.bestGrap = this.add.graphics();
		this.bestGrap.setDefaultStyles({
			fillStyle: { color: 0xFF00FF, alpha: 1 },
			lineStyle: { color: 0xFF00FF, alpha: 1, width: 4 }
		});

		var rect = Phaser.Geom.Rectangle.Clone(this.cameras.main);
		rect.setPosition(50).setSize(rect.width - 50, (rect.height - 50) / 2);

		this.info = this.add.text(20, 20, ((this.counter / this.totalPermutation) * 100).toFixed(2)+' %', {
			font: '20px Tahoma'
		});
		for (var i = 0; i < this.totalCities; i++) {
			var p = rect.getRandomPoint();
			this.order.push(i);
			this.grap.fillCircle(p.x, p.y, 8);
			this.cities.push(new Phaser.Math.Vector2(p.x, p.y));
		}
		this.recordDistance = this.calcDistance(this.cities, this.order);
		this.bestEver = this.order.slice();
		this.timer = this.time.addEvent({
			delay: 50,
			loop: true,
			callbackScope: this,
			callback: () => {
				this.grap.clear();
				this.bestGrap.clear();
				for (var i = 0; i < this.cities.length; i++) {
					this.grap.fillCircle(this.cities[i].x, this.cities[i].y, 8, 8);
				}
				for (i = 0; i < this.order.length - 1; i++) {
					var cityA = this.cities[this.bestEver[i]];
					var cityB = this.cities[this.bestEver[i+1]];
					this.bestGrap.moveTo(cityA.x, cityA.y);
					this.bestGrap.lineTo(cityB.x, cityB.y);
					this.bestGrap.strokePath();

					cityA = this.cities[this.order[i]];
					cityB = this.cities[this.order[i+1]];
					this.grap.moveTo(cityA.x, cityA.y + this.game.config.height / 2);
					this.grap.lineTo(cityB.x, cityB.y + this.game.config.height / 2);
					this.grap.strokePath();
				}
				var d = this.calcDistance(this.cities, this.order);
				if(d < this.recordDistance) {
					this.recordDistance = d;
					this.bestEver = this.order.slice();
				}
				this.nextOrder();
				this.info.setText([
					'totalCities: '+this.totalCities,
					'count: '+this.counter,
					'totalPermutation: '+this.totalPermutation,
					((this.counter / this.totalPermutation) * 100).toFixed(2)+'%'
				]);
			},
		});
	}
	nextOrder() {
		this.counter++;
		var largestI = -1;
		for (var i = 0; i < this.order.length - 1; i++) {
			if (this.order[i] < this.order[i + 1]) {
				largestI = i;
			}
		}
		if(largestI === -1) {
			this.timer.remove();
		}
		// STEP 2
		var largestJ = -1;
		for (var j = 0; j < this.order.length; j++) {
			if (this.order[largestI] < this.order[j]) {
				largestJ = j;
			}
		}
		// STEP 3
		this.swap(this.order, largestI, largestJ);
		// STEP 4
		var endArray = (this.order.splice(largestI + 1)).reverse();
		this.order = this.order.concat(endArray);

	}
	calcDistance(points, order) {
		var sum = 0;
		for (var i = 0; i < order.length - 1; i++) {
			var p = points[order[i]];
			var p1 = points[order[i+1]];
			sum += p.distance(p1);
		}
		return sum;
	}
	swap(a, i, j) {
		var temp = a[i];
		a[i] = a[j];
		a[j] = temp;
	}
}

