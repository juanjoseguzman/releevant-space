/**
 * Variables used during the game.
 */
let background;
let backgroundDos;
let player;
let enemy;
let cursors;
let spaceBar;
let bullet=[];
let contBullet = 0;
let frame = -1;
let contador = -1;
let score = 0;
let scoreText;



/**
 * It prelaods all the assets required in the game.
 */
function preload() {
  this.load.image("sky", "assets/backgrounds/blue.png");
  this.load.image("player", "assets/characters/player.png");
  this.load.image("enemy", "assets/characters/alien1.png");
  this.load.image("red", "assets/particles/red.png");
}

/**
 * It creates the scene and place the game objects.
 */
function create() {
  // scene background
  background = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "sky");
  backgroundDos = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - background.height, "sky");

  // playet setup
  player = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "player");
  player.setX((SCREEN_WIDTH - player.width * PLAYER_SCALE) / 2);
  player.setY(SCREEN_HEIGHT - (player.height * PLAYER_SCALE) / 2);
  player.setScale(PLAYER_SCALE);

  // enemy setup
  enemy = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "enemy");
  enemy.setX((SCREEN_WIDTH - enemy.width * ENEMY_SCALE) / 2);
  enemy.setY((enemy.height * ENEMY_SCALE) / 2);
  enemy.setScale(ENEMY_SCALE);

  //cursors map into game engine
  cursors = this.input.keyboard.createCursorKeys();

  //map space key status
  spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //Texto Score
  scoreText = this.add.text(5, 5, "Score: "+ score);//Texto Score
}



/**
 * Updates each game object of the scene.
 */
function update() {
  moverPlayer();
  moverFondo();
  if(frame<0){
    disparar(this);
  }
  if (contBullet>0){
    moverBala();
  }
  frame--;
  contador--;
}

function puntuacion(){
  contador = 5;
  score+=10;
  scoreText.setText("Score: " +score)
}

function colision(bala){
  if ((bala.x>=enemy.x-(enemy.width * ENEMY_SCALE)/2 && 
    bala.x<=enemy.x+(enemy.width * ENEMY_SCALE)/2) &&
    (bala.y>=enemy.y-(enemy.height * ENEMY_SCALE)/2 &&
    bala.y<=enemy.y+(enemy.height * ENEMY_SCALE)/2)){
    if (contador < 0){
      puntuacion()
    }
    enemy.setX(Math.floor(Math.random()*(SCREEN_WIDTH - enemy.width)+enemy.width/2));
    bala.destroy();
  }
}

function disparar(engine){
  if(spaceBar.isDown){
    bullet.push(engine.add.ellipse(player.x, player.y - player.height/2 * PLAYER_SCALE -5, 5, 10, 0xf5400a))
    contBullet++;
    frame = 10;
  }
}

function moverBala(){
  for (let bala of bullet){
    bala.setY(bala.y - BULLET_VELOCITY)
    if (bala.y < 0){ //para q desaparezca la bala por la parte superior
      bala.destroy()
    }
    colision(bala);
  }
}

function moverFondo(){
  background.setY(background.y + BACKGROUND_VELOCITY);
  backgroundDos.setY(backgroundDos.y + BACKGROUND_VELOCITY);

  if (background.y > background.height + SCREEN_HEIGHT/2){ // = 1024 + 300
    background.setY(backgroundDos.y - background.height);

    let temporal = background;
    background = backgroundDos;
    backgroundDos = temporal;
  }
}

function moverPlayer(){
  if (cursors.left.isDown) {
    let x = player.x - PLAYER_VELOCITY;

    if (x < (player.width / 2) * PLAYER_SCALE){
      x = player.width / 2 * PLAYER_SCALE;
    }

    player.setX(x);
  } if (cursors.right.isDown){
    let x = player.x + PLAYER_VELOCITY;

    if (x > SCREEN_WIDTH - (player.width / 2) * PLAYER_SCALE){
      x = SCREEN_WIDTH - player.width / 2 * PLAYER_SCALE;
    }

    player.setX(x);
  } if (cursors.up.isDown){
    let y = player.y - PLAYER_VELOCITY;

    if (y < (player.height / 2) * PLAYER_SCALE){
      y = player.height / 2 * PLAYER_SCALE;
    }

    player.setY(y);
  } if (cursors.down.isDown){
    let y = player.y + PLAYER_VELOCITY;

    if (y > SCREEN_HEIGHT - (player.height / 2) * PLAYER_SCALE){
      y = SCREEN_HEIGHT - player.height / 2 * PLAYER_SCALE;
    }

    player.setY(y);
}
}

