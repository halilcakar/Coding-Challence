/**
 * #35.1 - Traveling Person
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
		this.grap = this.add.graphics();
		this.grap.setDefaultStyles({
			fillStyle: { color: 0xFFFFFF, alpha: 1 },
			lineStyle: { color: 0xFFFFFF, alpha: 1, width: 2 }
		});
		this.cities = [];
		this.totalCities = 10;
		var rect = Phaser.Geom.Rectangle.Clone(this.cameras.main);
		rect.setPosition(50).setSize(rect.width - 50, rect.height - 50);

		for (var i = 0; i < this.totalCities; i++) {
			var p = rect.getRandomPoint();
			this.cities.push(new Phaser.Math.Vector2(p.x, p.y));
		}

		this.recordDistance = Number.MAX_VALUE;
		this.bestEver = undefined;
		this.bestGrap = this.add.graphics();
		this.bestGrap.setDefaultStyles({
			fillStyle: { color: 0xFF00FF, alpha: 1 },
			lineStyle: { color: 0xFF00FF, alpha: 1, width: 4 }
		});

		this.time.addEvent({
			delay: 500,
			repeat: -1,
			callbackScope: this,
			callback: () => {
				this.grap.clear();
				for (var i = 0; i < this.cities.length; i++) {
					var p = this.cities[i];
					this.grap.fillCircle(p.x, p.y, 8);
					if(this.cities[i+1]) {
						var p1 = this.cities[i+1];
						this.grap.moveTo(p.x, p.y);
						this.grap.lineTo(p1.x, p1.y);
						this.grap.strokePath();
					}
				}
				Phaser.Utils.Array.Shuffle(this.cities);
				var d = this.calcDistance(this.cities);
				if(d < this.recordDistance) {
					console.log('Record renew');
					this.recordDistance = d;
					this.bestEver = this.cities.slice();
					this.bestGrap.clear();
					for (i = 0; i < this.bestEver.length - 1; i++) {
						p = this.bestEver[i];
						this.bestGrap.fillCircle(p.x, p.y, 8);
						p1 = this.bestEver[i+1];
						this.bestGrap.moveTo(p.x, p.y);
						this.bestGrap.lineTo(p1.x, p1.y);
						this.bestGrap.strokePath();
					}
				}
			},
		});
	}
	calcDistance(points) {
		var sum = 0;
		for (var i = 0; i < points.length - 1; i++) {
			var p = points[i];
			var p1 = points[i+1];
			sum += p.distance(p1);
		}
		return sum;
	}
}

