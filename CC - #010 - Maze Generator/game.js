/**
 * #10 - Maze Generator
 * */
let game;
window.onload = function() {
	const gameConfig = {
		width: 800,
		height: 800,
		backgroundColor: 0x000000,
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
		super({ key: 'SimpleScene' });
	}
	create() {
		let w = 20;
		this.grid = [];
		this.stack = [];
		this.cols = parseInt(this.game.config.width / w);
		this.rows = parseInt(this.game.config.height / w);
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				this.grid.push(new Cell(this, i, j, w));
			}
		}
		this.current = this.grid[0];

		this.input.on('pointerdown', () => {
			let timedEvent = this.time.addEvent({
				delay: 10,
				callback: () => {
					if(this.current) {
						this.current.visited = true;
						// STEP 1
						let next = this.current.checkNeighbors();

						if(next) {
							//STEP 2
							this.stack.push(this.current);
							// STEP 3
							this.removeWalls(this.current, next);
							// STEP 4
							this.current = next;
						}
						else {
							//STEP 2.1
							this.current = this.stack.pop();
						}
					}
					else {
						timedEvent.remove(false);
						this.current = this.grid[0];
					}
				},
				callbackScope: this,
				loop: true
			});
		});
	}
	removeWalls(c, n) {
		let x = c.i - n.i;
		if(x === 1) { c.walls[3] = false; n.walls[1] = false; }
		else if(x === -1) { c.walls[1] = false; n.walls[3] = false; }

		let y = c.j - n.j;
		if(y === 1) { c.walls[0] = false; n.walls[2] = false; }
		else if(y === -1) { c.walls[2] = false; n.walls[0] = false; }
	}
	getGrid(i, j) {
		if(i < 0 || j < 0 || i > this.cols - 1 || j > this.rows - 1) {
			return null;
		}
		return this.grid[i + j * this.cols];
	}
	update() {
		for (let i = 0; i < this.grid.length; i++) {
			this.grid[i].update();
		}
		if(this.current) {
			this.current.highlight();
		}
	}
}

class Cell extends Phaser.GameObjects.Graphics{
	constructor(scene, i, j, w) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;
		this.walls = [true, true, true, true];
		this.w = w;
		this.i = i; this.j = j;
		this.x = i * w; this.y = j * w;
		this.visited = false;
		this.setDefaultStyles({
			fillStyle: { color: 0xFF00FF, alpha: .3 },
			lineStyle: { width: 2, color: 0xFFFFFF, alpha: 1 }
		});
		this.update();
	}
	update() {
		this.clear();
		this.beginPath();
		this.moveTo(0, 0);
		if(this.walls[0]) { this.lineTo(this.w, 0); }
		this.moveTo(this.w, 0);
		if(this.walls[1]) { this.lineTo(this.w, this.w); }
		this.moveTo(this.w, this.w);
		if(this.walls[2]) { this.lineTo(0, this.w); }
		this.moveTo(0, this.w);
		if(this.walls[3]) { this.lineTo(0, 0); }
		this.strokePath();

		if(this.visited) {
			this.fillRect(0, 0, this.w, this.w);
		}
	}
	highlight() {
		this.fillStyle(0x009900, 1);
		this.fillRect(0, 0, this.w, this.w);
	}
	checkNeighbors() {
		let neighbors = [];
		let top = this.scene.getGrid(this.i, this.j - 1);
		let right = this.scene.getGrid(this.i + 1, this.j);
		let bottom = this.scene.getGrid(this.i, this.j + 1);
		let left = this.scene.getGrid(this.i - 1, this.j);
		if(top && !top.visited) { neighbors.push(top); }
		if(right && !right.visited) { neighbors.push(right); }
		if(bottom && !bottom.visited) { neighbors.push(bottom); }
		if(left && !left.visited) { neighbors.push(left); }
		if(neighbors.length > 0) {
			let r = Math.round(random(0, neighbors.length - 1));
			console.log(r);
			return neighbors[r];
		}
		return undefined;
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
