var game;
window.onload = () => {
    const gameConfig = {
        width: 600,
        height: 600,
        backgroundColor: 0x000000,
        resolution: 1,
        scene: SimpleScene
    };
    game = new Phaser.Game(gameConfig);
    window.focus();
    resizeGame();
    window.addEventListener('resize', resizeGame);
};
var Star = new Phaser.Class({
    Extends: Phaser.GameObjects.Graphics,
    initialize: function (scene, area){
        Phaser.GameObjects.Graphics.call(this, scene);
        this.area = area;
        scene.add.existing(this);
        this.create();
    },
    create: function (){
        this.WIDTH = this.scene.game.config.width;
        this.HEIGHT = this.scene.game.config.height;
        this.pz = this.z;
        this.x = this.WIDTH / 2;
        this.y = this.HEIGHT / 2;
        this.rnd = this.area.getRandomPoint();
        this._z = Math.random() * this.area.width;
        this.setDefaultStyles({
            lineStyle: {
                width: 3,
                color: 0xffffff,
                alpha: 1
            },
            fillStyle: {
                color: 0xffffff,
                alpha: 1
            }
        });
        this.fillCircle(this.rnd.x, this.rnd.y, 3);
        this.pz = this._z;
    },
    update: function (_z){
        this._z -= _z || 10;
        var px, py;
        if(this._z < 1) {
            this._z = this.area.width;
            this.rnd = this.area.getRandomPoint();
            this.pz = this._z;
        }
        var x = this.area.x, y = this.area.y, width = this.area.width, height = this.area.height;
        var sx = map(this.rnd.x / this._z, 0, 1, 0, width);
        var sy = map(this.rnd.y / this._z, 0, 1, 0, height);
        var r = map(this._z, 0, width, 8, 0);
        this.clear();
        this.fillCircle(sx, sy, r);

        px = map(this.rnd.x / this.pz, 0, 1, 0, width);
        py = map(this.rnd.y / this.pz, 0, 1, 0, height);
        this.moveTo(px, py);
        this.lineTo(sx, sy);
        this.strokePath();
        this.pz = this._z;
    }
});
var SimpleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this);
        this.speed = 20;
    },
    create: function (){
        var width = this.game.config.width, height = this.game.config.height;
        this.area = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);

        this.stars = [];
        for (var i = 0; i < 400; i++) {
            this.stars[i] = new Star(this, this.area);
        }

        this.input.on('pointermove', function (pointer) {
            this.speed = map(pointer.worldX, 0,
                pointer.manager.game.config.width,0,100);
        }, this);
    },
    update: function (){
        var speed = this.speed;
        this.stars.forEach(star =>{
            star.update(speed);
        });
    }
});
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