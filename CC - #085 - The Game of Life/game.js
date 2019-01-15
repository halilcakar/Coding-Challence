/**
 * #85 - The Game of Life
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
		this.resolution = 40;
		this.cols = this.game.config.width / this.resolution;
		this.rows = this.game.config.width / this.resolution;
		this.grid = this.make2DArray(this.cols, this.rows);
		this.next = this.make2DArray(this.cols, this.rows);

		this.grap = this.add.graphics();
		this.grap.setDefaultStyles({
			fillStyle: { color: 0x333333, alpha: 1 },
			lineStyle: { width: 1, color: 0x333333 }
		});
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				let x = i * this.resolution, y = j * this.resolution;
				if (this.grid[i][j]) {
					this.grap.fillRect(x, y, this.resolution - 1, this.resolution - 1);
				}
			}
		}

		let timer = this.time.addEvent({
			delay: 100,
			repeat: -1,
			callbackScope: this,
			callback: () => {
				this.grap.clear();
				for (let i = 0; i < this.cols; i++) {
					for (let j = 0; j < this.rows; j++) {
						let x = i * this.resolution, y = j * this.resolution;
						if (this.grid[i][j] === 1) {
							this.grap.fillRect(x, y, this.resolution - 1, this.resolution - 1);
						}
					}
				}
				let temp = [].concat(this.grid);
				for (let i = 0; i < this.cols; i++) {
					for (let j = 0; j < this.rows; j++) {
						let state = this.grid[i][j];
						let neighbors = this.countNeighbors(this.grid, i, j);
						if (state === 0 && neighbors === 3) {
							this.next[i][j] = 1;
						}
						else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
							this.next[i][j] = 0;
						}
						else {
							this.next[i][j] = state;
						}
					}
				}
				this.grid = [].concat(this.next);
				this.next = [].concat(temp);
			}
		});
	}
	countNeighbors(grid, x, y) {
		let sum = 0;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let col = (x + i + this.cols) % this.cols;
				let row = (y + j + this.rows) % this.rows;
				sum += grid[col][row];
			}
		}
		sum -= grid[x][y];
		return sum;
	}
	make2DArray(cols, rows) {
		var grid = new Array(cols);
		for (let i = 0; i < cols; i++) {
			grid[i] = [];
			for (let j = 0; j < rows; j++) {
				grid[i][j] = Math.round(Math.random());
			}
		}
		console.table(grid);
		return grid;
	}
}

