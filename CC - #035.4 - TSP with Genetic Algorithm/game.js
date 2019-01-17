/**
 * #35.4 - Traveling Salesperson with Genetic Algorithm
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
		this.counter = 0;
		this.cities = [];
		this.population = [];
		this.totalCities = 10;
		this.populationLength = 1000;
		this.recordDistance = Number.MAX_VALUE;
		this.bestEver = undefined;
	}
	create() {
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
		rect.setPosition(50).setSize(rect.width - 50, (rect.height - 50));

		this.info = this.add.text(20, 20, [
			'counter: '+this.counter,
			'totalCities: '+this.totalCities,
			'generatedPopulationLength: '+this.populationLength
		], {
			font: '20px Tahoma'
		});

		this._order = [];
		for (var i = 0; i < this.totalCities; i++) {
			var p = rect.getRandomPoint();
			this._order.push(i);
			this.grap.fillCircle(p.x, p.y, 8);
			this.cities.push(new Phaser.Math.Vector2(p.x, p.y));
		}
		this.timer = this.time.addEvent({
			delay: 50,
			loop: true,
			callbackScope: this,
			callback: () => {
				this.calculateFitness();
				this.normalizeFitness();
				this.nextGeneration();
				this.grap.clear();
				this.bestGrap.clear();
				for (var i = 0; i < this.cities.length; i++) {
					this.grap.fillCircle(this.cities[i].x, this.cities[i].y, 8, 8);
				}
				for (i = 0; i < this.bestEver.length - 1; i++) {
					var cityA = this.cities[this.bestEver[i]];
					var cityB = this.cities[this.bestEver[i+1]];
					this.bestGrap.moveTo(cityA.x, cityA.y);
					this.bestGrap.lineTo(cityB.x, cityB.y);
					this.bestGrap.strokePath();
				}
			},
		});
	}
	calculateFitness() {
		for (var i = 0; i < this.populationLength; i++) {
			var order = Phaser.Utils.Array.Shuffle(this._order.slice());
			var fitness = this.calcDistance(this.cities, order);
			if(fitness < this.recordDistance) {
				this.recordDistance = fitness;
				this.bestEver = order.slice();
			}
			this.population[i] = ({ order, fitness });
		}
	}
	normalizeFitness() {
		var sum = 0;
		this.population.forEach((child) => sum += child.fitness);
		this.population.forEach((child) => child.fitness /= sum);
	}
	nextGeneration() {
		this.counter++;
		for (var i = 0; i < this.population.length; i++) {
			var child = this.pickOne(this.population[i]);
			this.population[i] = this.mutate(child, 5);
		}
		this.info.setText([
			'generationCounter: '+this.counter,
			'totalCities: '+this.totalCities,
			'generatedPopulationLength: '+this.populationLength,
			'recordDistance: '+this.recordDistance.toFixed(2)+'px',

		]);
	}
	pickOne(child) {
		var index = 0;
		var r = random(1);
		while(r > 0) {
			r = r - child.fitness;
			index++;
		}
		index--;
		return child;
	}
	mutate(arr, mutationRatio) {
		for (var i = 0; i < mutationRatio; i++) {
			var indA = Math.floor(random(arr.length));
			var indB = Math.floor(random(arr.length));
			this.swap(arr, indA, indB);
		}
		return arr;
	}
	swap(a, i, j) {
		var temp = a[i];
		a[i] = a[j];
		a[j] = temp;
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
}

