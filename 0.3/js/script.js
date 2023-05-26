/**@type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 20;
const enemiesArray = [];

// const enemyImage = new Image();
// enemyImage.src = '/0.3/images/enemy1.png'
let gameFrame = 0;
// enemy1 = {
//     x:0,
//     y:0,
//     width:200,
//     height:200
// }

class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = '/0.3/images/enemy4.png';
        // this.image.src = `/0.3/images/enemy${Math.floor(Math.random() * 3 + 1)}.png`;
        // this.width = 100;
        // this.height = 100;
        this.speed = Math.random() * 4 - 2;
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 3;
        this.height = this.spriteHeight / 3;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        //this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.flapSpeed = (Math.random() * 3 + 1).toFixed(0);
        this.interval = (Math.random() * 200 + 50).toFixed(0);
        // this.angle = Math.random() * 2;
        // this.angleSpeed = Math.random() * 2;
        // this.curve = Math.random() * 200 + 50;
    }

    update() {
        // this.x > CANVAS_WIDTH ? this.x = 0 : this.x += this.speed;
        // this.y > CANVAS_HEIGHT ? this.y = 0 : this.y += this.speed;
        // this.x -= this.speed;
        // this.x = canvas.width / 2 * Math.cos(this.angle * Math.PI / 90) +
        //     (canvas.width / 2 - this.width / 2);
        // this.y += this.curve * Math.sin(this.angle)
        // this.y = canvas.height / 2 * Math.sin(this.angle * Math.PI / 270) +
        //     (canvas.height / 2 - this.height / 2);
        // this.x = 0;
        // this.y = 0;
        // this.angle += this.angleSpeed;
        // this.y += Math.random() * 5 - 2.5;
        if (gameFrame % this.interval === 0){
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/20;
        this.y -= dy/20;
        if (this.x + this.width < 0) this.x = canvas.width;
        //animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }


    }

    draw() {
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};
for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray.push(new Enemy());
}

const enemy1 = new Enemy();
const enemy2 = new Enemy();

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // enemy1.update();
    // enemy1.draw();
    for (enemy of enemiesArray) {
        enemy.update();
        enemy.draw();
    }
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();