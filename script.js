// evento escucha cuando cargamos nuestra app
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 500;

    // clase input, permite reconocer cuando una tecla se preciona o se suelta una tecla
    class InputHandler{
        constructor(game){
            this.game = game;

            // evento listen, escucha cuando una tecla es precionada 
            window.addEventListener('keydown', e => {
                if(( (e.key === 'ArrowUp') || (e.key === 'ArrowDown') )&& this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }else if(e.key === ' '){
                    this.game.player.shootTop();
                }else if(e.key === 'r'){
                    this.game.keys.push(e.key);
                }
            });

            // evento listen, escucha cuando una tecla se deja de precionar
            window.addEventListener('keyup', e => {
                if(this.game.keys.indexOf(e.key)>-1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1);
                }
            })
        }
    }

    // clase proyectil, contiene los metodos y propiedades de los proyectiles generados
    class Projectile{
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 6;//Aumentamos el height x6
            this.speed = 5;//Aumentamos la velocidad del proyectil x5
            this.markedForDeletion = false;
        }

        // metodo update, permite visualizar el cambio entre coordenadas simulando el desplazamiento
        update(){
            this.x += this.speed;
            if(this.x > this.game.width * 0.8){
                this.markedForDeletion = true;
            }
            if(!this.game.debug){
                this.speed = 6;
            }
        }

        // metodo draw, permite dibujarlo en la pantalla
        draw(context){
            if(this.game.debug) context.fillStyle = 'red'; //Cambiamos el color del proyectil a rojo
            else context.fillStyle = 'crimson';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // clase jugador, contiene los metodos y propiedades del jugador
    class Player{
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 1; //aumentamos la velocidad en el ejeY
            this.maxSpeed = 2;//aumentmos la velocidad maxima
            this.projectiles = [];
            this.img = document.getElementById('player');
            this.shot = document.getElementById('shot');
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }

        // metodo update, permite los movimientos del jugador cuando una tecla sea precionada,
        // ademas de contener la animacion de movimiento al cambiar de frame
        update(){
            if(this.game.keys.includes('ArrowUp')){
                this.speedY = -this.maxSpeed;
            }else if(this.game.keys.includes('ArrowDown')){
                this.speedY = this.maxSpeed;
            }else{
                this.speedY = 0;
            }
            this.y += this.speedY;
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;

            if(!this.game.debug){
                this.frameY = 1;
                this.maxSpeed = 3;
                setTimeout(() => {
                    this.frameY = 0;
                    this.maxSpeed = 1;
                }, 5000)
            }
        }

        // metodo draw, dibuja el jugador en pantalla
        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(
                this.img, this.frameX * this.width, this.frameY * this.height,
                this.width, this.height, this.x, this.y, this.width, this.height
            );
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            })
        }

        // metodo municion, permite la accion de crear un nuevo projectile cuando la tecla sea acccionada
        shootTop(){
            if(this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo--;
                this.shot.play();    
            }
        }
    }

    // metodo enemy, contiene las propiedades y funciones
    class Enemy {
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * - 1.5 - 0.5;
            this.markedForDeletion = false;
            this.lives = 4;//aumentamos las vidas de los enemigos
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }

        // metodo update, permite mostrar la animacion de movimiento y desplazamiento
        update(){
            this.x += this.speedX - this.game.speed;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            };
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else {
                this.frameX = 0;
            }
        }

        // metodo draw, permite dibujarlo en pantalla
        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(
                this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width, this.height,
                this.x, this.y,
                this.width, this.height
            )
            context.fillStyle = 'black';
            context.font = '20px Roboto'; //Modificamos el tipo de letra
            context.fillText(this.lives, this.x, this.y);
        }
    }
    
    // metodo enemy1, contiene los parametros que tendra un tipo de enemigo en especifico 
    // ademas de extenderse de la clase enemy principal
    class Angler1 extends Enemy {
        constructor(game){
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
            this.lives = 2
        }
    }

    // metodo enemy2, contiene los parametros que tendra un tipo de enemigo en especifico 
    class Angler2 extends Enemy {
        constructor(game){
            super(game);
            this.width = 213;
            this.height = 165;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 2;//Modificamos la cantidad de vida del otro metodo enemy
        }
    }

    // metodo enemy3, contiene los parametros que tendra un tipo de enemigo especial 
    class Lucky extends Enemy {
        constructor(game){
            super(game);
            this.width = 99;
            this.height = 95;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 5;
            this.score = 10;//Aumentamos el número de puntaje del enemigo
            this.type = 'luck';
        }
    }

    // clase layer, contiene las propiedades y funciones del escenario
    class Layer {
        constructor(game, image, speedModify){
            this.game = game;
            this.image = image;
            this.speedModify = speedModify;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        // funcion que realiza el movimiento de desplazamiento en el escenario
        update(){
            if(this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModify;
        }

        // metodo draw, dibuja el escenario en pantalla
        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y + this.height)
        }
    }

    // clase escenarios, contiene las propiedades e imagenes a utilizar
    class Background {
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 0.3);
            this.layer2 = new Layer(this.game, this.image2, 0.5);
            this.layer3 = new Layer(this.game, this.image3, 1.3);
            this.layer4 = new Layer(this.game, this.image4, 1.8);
            this.layers = [this.layer1, this.layer2, this.layer3];
        }

        // funcion update, permite mandar a llamar la funcion layer principal
        update(){
            this.layers.forEach(layer => layer.update());
        }

        // funcion update, manda llamar la funcion draw de layer
        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }
    }

    // clase ui, contiene propiedades y funciones de la interfaz
    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Roboto';//cambiamos el tipo de letra de helvetica a roboto
            this.color = 'white';
        }

        // metodo draw, contiene los detalles de la interfaz que son dibujado en pantalla
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            
            context.font = this.fontSize; + 'px ' + this.fontFamily;
            context.fillText('Score: ' + this.game.score, 20, 40);

            for(let i=0; i<this.game.ammo; i++){
                context.fillRect(20 + i * 6 + 3, 50, 3, 20);
            }

            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime, 580, 40);
            
            context.fillText('Energia acumulada: ' + this.game.energy, 20, 100);

            if(this.game.gameOver){
                context.textAlign = 'center';
                let msg1;
                let msg2;

                if(this.game.score > this.game.winningScore){
                    msg1 = 'You Win!'
                    msg2 = "Hell yeah! You're the madafucker shit dawg"//modificamos el mensaje que se muestra cuando ganamos
                }else {
                    msg1 = 'You Lose';
                    msg2 = 'Give up retard';//cambiamos el mensaje de perdida
                }
                context.font = '60px ' + this.fontFamily;
                context.fillText(msg1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '25px ' + this.fontFamily;
                context.fillText(msg2, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            context.restore();
        }
    }

    // clase game, contiene todas las propiedades principales para el funcionamiento del juego
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.background = new Background(this);
            this.keys = [];
            this.ammo = 20;
            this.ammoTimer = 0;
            this.ammoInterval = 600;
            this.maxAmmo = 50;
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 65;
            this.gameTime = 0;
            this.timeLimit = 40000;
            this.speed = 1;
            this.energy = 0;
            this.debug = true;
            this.powerUp = document.getElementById('powerUp');
            this.powerDown = document.getElementById('powerDown');
        }

        // metodo update, genera los intervalos de aparicion en las balas y enemigos
        update(deltaTime){
            if(!this.gameOver) this.gameTime += deltaTime;
            if(this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update();
            this.background.layer4.update();
            this.player.update();
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo){
                    this.ammo++;
                    this.ammoTimer = 0;
                }
            }else{
                this.ammoTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update();
                if(this.checkCollision(this.player, enemy)){
                    enemy.markedForDeletion = true;
                }
                this.player.projectiles.forEach(projectile => {
                    if(this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if(enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            if(!this.gameOver) this.score += enemy.score;
                            if(this.score > this.winningScore) this.gameOver = true;
                            if(this.energy <= 87) this.energy += 13;
                            else {
                                this.energy = 0;
                                this.debug = false;
                                this.ammoInterval = 400;
                                this.powerUp.play();
                                setTimeout(() => {
                                    this.powerDown.play();
                                    this.ammoInterval = 600;
                                    this.debug = true;
                                }, 5000);
                            }
                        }
                    }
                })
            })

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if(this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            }else {
                this.enemyTimer += deltaTime;
            }
        }

        // funcion draw, genera los elementos necesarios en pantalla (jugador, interfaz, escenario y enemigo)
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
            this.background.layer4.draw(context);
        }

        // funcion de choque cuando son tocados
        checkCollision(rect1, rect2){
            return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width >
                rect2.x && rect1.y + rect2.y + rect2.height && rect1.height + rect1.y
                > rect2.y
            )
        }

        // funcion addEnemy, genera los enemigos de manera aletoria
        addEnemy(){
            const randomize = Math.random();
            if(randomize < 0.3) this.enemies.push(new Angler1(this));
            else if(randomize < 0.6) this.enemies.push(new Angler2(this));
            else this.enemies.push(new Lucky(this));
        }

    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp-lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);
});