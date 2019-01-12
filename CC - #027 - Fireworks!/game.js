/**
 * #27 - Fireworks!
 * */
let game;
let gravity = new Phaser.Geom.Point(0, .2);
window.onload = function() {
	const gameConfig = {
		width: 400,
		height: 300,
		backgroundColor: 0x000000,
		resolution: 1,
		scene: [ SimpleScene ]
	};
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame();
	window.addEventListener('resize', resizeGame);
};

let SimpleScene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function(){
		Phaser.Scene.call(this);
	},
	create: function (){
		this.fireworks = [];
		this.fireworks.push(new Firework(this, gravity));
	},
	update: function (){
		if(random(1) < .01) {
			this.fireworks.push(new Firework(this, gravity));
		}
		for(let i = this.fireworks.length - 1; i >= 0; i--) {
			const child = this.fireworks[i];
			child.update();
			if(child.done()) {
				this.fireworks.splice(i, 1);
			}
		}
	}
});

let Firework = new Phaser.Class({
	initialize: function (scene, gravity) {
		this.scene = scene;
		this.gravity = gravity;
		this.firework = new Particle(scene, random(400), 300, true);
		this.exploded = false;
		this.particles = [];
		scene.add.existing(this);
	},
	update: function () {
		if(!this.exploded) {
			this.firework.update();
			this.firework.applyForce(this.gravity);
			if(this.firework.vel.y >= 0) {
				this.firework.destroy();
				this.exploded = true;
				this.explode();
			}
		}
		if(this.particles.length) {
			for (let i = this.particles.length - 1; i >= 0; i--) {
				const child = this.particles[i];
				child.update();
				child.applyForce(gravity);
				if(child.done()) {
					child.destroy();
					this.particles.splice(i, 1);
				}
			}
		}
	},
	done: function() {
		return this.exploded && this.particles.length === 0;
	},
	explode: function () {
		for (let i = 0; i < 100; i++) {
			let p = new Particle(this.scene, this.firework.pos.x, this.firework.pos.y);
			this.particles.push(p);
		}
	}
});

let Particle = new Phaser.Class({
	Extends: Phaser.GameObjects.Graphics,
	initialize: function (scene, x, y, firework) {
		Phaser.GameObjects.Graphics.call(this, scene);
		scene.add.existing(this);
		this.firework = firework;
		this.lifespan = 1;
		this.pos = new Phaser.Geom.Point(x, y);
		if(firework)
			this.vel = new Phaser.Geom.Point(0, random(-10, -5));
		else
			this.vel = new Phaser.Geom.Point(
				random(random(-5, 10), random(-5, 10)),
				random(random(-5, 10), random(-5, 10))
			);
		this.acc = new Phaser.Geom.Point(0, 0);
	},
	update: function() {
		if(this.lifespan > 0) {
			if(!this.firework) {
				this.vel.mult(.9);
				this.lifespan -= .009;
			}
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.draw();
		}
	},
	done: function() {
		return this.lifespan < 0;
	},
	draw() {
		this.clear();
		this.fillStyle(0xFFFFFF, this.lifespan);
		this.fillCircle(this.pos.x, this.pos.y, this.lifespan * 3);
	},
	applyForce: function (force) {
		this.acc.add(force);
	}
});

Phaser.Geom.Point.prototype.add = function (point) {
	this.x += point.x;
	this.y += point.y;
};
Phaser.Geom.Point.prototype.mult = function (point) {
	this.x *= point;
	this.y *= point;
};

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
