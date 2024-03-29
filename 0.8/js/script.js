window.addEventListener('load', function () {
    const canvas = document.querySelector('#canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    const fullScreenButton = document.querySelector('#fullScreenButton');

    class InputHandler {
        constructor() {
            this.keys = [];
            this.touchY = '';
            this.touchTreshold = 30;
            window.addEventListener('keydown', ev => {
                if ((ev.key === 'ArrowDown' ||
                    ev.key === 'ArrowUp' ||
                    ev.key === 'ArrowLeft' ||
                    ev.key === 'ArrowRight') && this.keys.indexOf(ev.key) === -1) {
                    this.keys.push(ev.key);
                } else if(ev.key == 'Enter' && gameOver){
                    restartGame();
                }
            });
            window.addEventListener('keyup', ev => {
                if (ev.key === 'ArrowDown' ||
                    ev.key === 'ArrowUp' ||
                    ev.key === 'ArrowLeft' ||
                    ev.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(ev.key), 1);
                }
                console.log(ev.key, this.keys);
            });
            window.addEventListener('touchstart',ev=>{
                this.touchY = ev.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove',ev=>{
                const swipeDistance = ev.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
                else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down')
                    if (gameOver) restartGame();
                }
            });
            window.addEventListener('touchend',ev=>{
                this.keys.splice(this.keys.indexOf('swipe up'),1);
                this.keys.splice(this.keys.indexOf('swipe down'),1);

            });

        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = playerImage;
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;

        }
        //enemy
        // context.arc(this.x + this.width/2 - 20, this.y + this.height/2, this.
        // width/3, 0, Math.PI * 2)
        //hero
        // context.arc(this.x + this.width/2, this.y + this.height/2 + 20, this.
        // width/3, 0, Math.PI * 2)
        update(input, deltaTime, enemies) {
            //collision detection
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width/2 - 20) - (this.x + this.width/2);
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2 + 20) ;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width/3 + this.width/3) gameOver = true;
            })
            //sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime
            }

            //horizontal movement
            this.x += this.speed;
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else if ((input.keys.indexOf('ArrowUp') > -1 ||input.keys.indexOf('swipe up') > -1) && this.onGround()) {
                this.vy -= 30;
            } else {
                this.speed = 0;
            }
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

            //vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.maxFrame = 5;
                this.frameY = 1;
            } else {
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }

        onGround() {
            return this.y >= this.gameHeight - this.height
        }

        restart(){
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }

        draw(context) {
            // context.strokeStyle = 'blue';
            // context.beginPath()
            // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            // context.stroke();
            // context.lineWidth = 5;
            // context.strokeStyle = 'white';
            // context.beginPath();
            // context.arc(this.x + this.width/2, this.y + this.height/2 + 20, this.
            //     width/3, 0, Math.PI * 2)
            // context.stroke();
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = backgroundImage;
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }

        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }

        restart(){
            this.x = 0;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = enemyImage;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 8;
            this.markedForDeletion = false;
        }

        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }

        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, 0, this.
                width, this.height, this.x, this.y, this.width, this.height);
            // context.lineWidth = 5;
            // context.strokeStyle = 'white';
            // context.beginPath();
            // context.arc(this.x + this.width/2 - 20, this.y + this.height/2, this.
            //     width/3, 0, Math.PI * 2)
            // context.stroke();
        }
    }


    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.update(deltaTime)
            enemy.draw(ctx);
        })
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatusText(context) {
        context.textAlign = 'left';
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText(`Score: ${score}`, 20, 50);
        context.fillStyle = 'white';
        context.fillText(`Score: ${score}`, 22, 52);
        if (gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText(`GAME OVER, press Enter or swipe down to restart!`, canvas.width / 2, 200)
            context.fillStyle = 'white';
            context.fillText(`GAME OVER, press Enter or swipe down to restart!`, canvas.width / 2 + 2, 202)
        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }


    //document.fullscreenElement is a built-in read only property on document object
    //that returns the element that is currently being presented in full screen mode.
    //If it's null it means full screen is not active.

    //null could represent false
    function toggleFullScreen(){
      console.log(document.fullscreenElement);
      if (!document.fullscreenElement) {
          //.requestFullscreen() method is asynchronous, returns a Promise
          //canvas.requestFullscreen().then().catch();
          canvas.requestFullscreen().catch(err =>{
              alert(`Error, can't enable full-screen mode: ${err.message}`);
          });
      } else {
          document.exitFullscreen();
      }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen)


    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        background.update();
        background.draw(ctx);
        player.update(input, deltaTime, enemies);
        player.draw(ctx);
        handleEnemies(deltaTime);
        displayStatusText(ctx);

        if (!gameOver) requestAnimationFrame(animate);
    }

    animate(0);
});