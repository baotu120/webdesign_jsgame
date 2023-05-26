const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];
//getBoundingClientRect是参照视窗顶端，offset是参照文档
let canvasPosition = canvas.getBoundingClientRect();


class Explosion {
    constructor(x, y) {

        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        //点击时，鼠标在图像正中
        // this.x = x - this.width/2;
        // this.y = y - this.height/2;
        //旋转时+鼠标移动，鼠标在图像正中
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = '/0.5/images/boom.png';
        this.frame = 0;
        this.timer = 0;
        this.angle = Math.random() * 6.2;
        this.sound = new Audio();
        this.sound.src = '/0.5/audio/boom.wav';
    }

    update() {
        if (this.frame === 0) this.sound.play();
        this.timer++;
        if (this.timer % 20 === 0) {
            this.frame++;
        }
    }

    draw() {
        //ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0,
            this.spriteWidth, this.spriteHeight,
            0 - this.width / 2, 0 - this.height / 2, this.width, this.height);
        ctx.restore();

        //点击时，鼠标在图像正中
        // ctx.drawImage(this.image,this.spriteWidth * this.frame,0,
        //     this.spriteWidth,this.spriteHeight,
        //     this.x,this.y,this.width,this.height);
    }
}

window.addEventListener('click', function (e) {
    // ctx.fillStyle = 'white';
    // ctx.fillRect(e.x-canvasPosition.left-25,e.y-canvasPosition.top-25,50,50);
    createAnimation(e);
});

window.addEventListener('mousemove', function (e) {
    // ctx.fillStyle = 'white';
    // ctx.fillRect(e.x-canvasPosition.left-25,e.y-canvasPosition.top-25,50,50);
    createAnimation(e);
});

function createAnimation(e) {
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY))
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw();
        if (explosions[i].frame > 5) {
            explosions.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
};
animate();