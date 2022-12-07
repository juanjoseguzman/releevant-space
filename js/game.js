/**
 * Variables used during the game.
 */
let background;
let backgroundDos;
let player;
let enemy;
let cursors;
let spaceBar;
let bullets = [];
let elapsedFrames;
let explosion;

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
  backgroundDos = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - background.height, "sky")

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

  // map space key status
  spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  elapsedFrames = FRAMES_PER_BULLET;

  explosion = this.add.particles("red").createEmitter({
    scale: { min: 0.5, max: 0 },
    speed: { min: -100, max: 100 },
    quantity: 10,
    frequency: 0.1,
    lifespan: 200,
    gravityY: 0,
    on: false,
  });
}

/**
 * Updates each game object of the scene.
 */
function update() {
  checkEnemyCollisions();

  moverFondo();
  moverPlayer();
  moverBalas();
  disparar(this);

  elapsedFrames--;
}

function moverFondo() {
  background.setY(background.y + BACKGROUND_VELOCITY);
  backgroundDos.setY(backgroundDos.y + BACKGROUND_VELOCITY);

  if (background.y > background.height + SCREEN_HEIGHT / 2) {
    background.setY(backgroundDos.y - background.height);

    let temporal = background;
    background = backgroundDos;
    backgroundDos = temporal;
  }
}

function moverPlayer() {
  if (cursors.left.isDown) {
    let x = player.x - PLAYER_VELOCITY;
    
    if (x  < (player.width / 2) * PLAYER_SCALE) {
      x = player.width / 2 * PLAYER_SCALE;
    }
    
    player.setX(x);
  } else if (cursors.right.isDown) {
    let x = player.x + PLAYER_VELOCITY;
    
    if (x  > SCREEN_WIDTH - (player.width / 2) * PLAYER_SCALE) {
      x = SCREEN_WIDTH - player.width / 2 * PLAYER_SCALE;
    }
    
    player.setX(x);
  }

  if (cursors.up.isDown) {
    let y = player.y - PLAYER_VELOCITY;
    
    if (y  < (player.height / 2) * PLAYER_SCALE) {
      y = player.height / 2 * PLAYER_SCALE;
    }
    
    player.setY(y);
  } else if (cursors.down.isDown) {
    let y = player.y + PLAYER_VELOCITY;
    
    if (y  > SCREEN_HEIGHT - (player.height / 2) * PLAYER_SCALE) {
      y = SCREEN_HEIGHT - player.height / 2 * PLAYER_SCALE;
    }
    
    player.setY(y);
  }
}

function moverBalas() {
  let index = 0;

  while (index < bullets.length) {
    bullets[index].setY(bullets[index].y - BULLET_VELOCITY);

    if (bullets[index].y < 0) {
      destroyBullet(index);
    } else {
      const enemyHalfWidth = enemy.width / 2 * ENEMY_SCALE;
      const enemyHalfHeight = enemy.height / 2 * ENEMY_SCALE;

      if ((bullets[index].x > (enemy.x - enemyHalfWidth) && bullets[index].x < (enemy.x + enemyHalfWidth)) 
          && (bullets[index].y < (enemy.y + enemyHalfHeight) && (bullets[index].y > (enemy.y - enemyHalfHeight)))){
        explosion.setPosition(enemy.x, enemy.y);
        explosion.explode();

        enemy.destroy();
        destroyBullet(index);
      } else {
        index++;
      }
    }
  }
}

function disparar(engine) {
  if (spaceBar.isDown && elapsedFrames < 0) {
    bullets.push(engine.add.ellipse(player.x, player.y - player.height / 2 * PLAYER_SCALE - 5, 5, 10, 0xf5400a));

    elapsedFrames = FRAMES_PER_BULLET;
  }
}

function checkEnemyCollisions() {
  for (const b of bullets) {
    const enemyHalfWidth = enemy.width / 2 * ENEMY_SCALE;
    const enemyHalfHeight = enemy.height / 2 * ENEMY_SCALE;

    if ((b.x > (enemy.x - enemyHalfWidth) && b.x < (enemy.x + enemyHalfWidth)) && (b.y < (enemy.y + enemyHalfHeight) && (b.y > (enemy.y - enemyHalfHeight)))){
      enemy.destroy();
    }
  }
}

function destroyBullet(index) {
  bullets[index].destroy();
  bullets.splice(index, 1);
}
