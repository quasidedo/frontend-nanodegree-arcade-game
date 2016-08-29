// Global variables
const MAXROWS = 7;
const MAXCOLS = 7;
const XSIDE = 101;
const YSIDE = 83;
const YSTARTPLAYER = 72;
const YSTARTENEMY = 62;
const YSTARTITEM = 52;

// Enemies our player must avoid
var Enemy = function(yRow) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = - 3 * XSIDE;
    this.y = yRow;
    this.speed = this.getRandomSpeed();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Set a different speed (between 150 and 600) for each enemy's ride
Enemy.prototype.getRandomSpeed = function() {
  return Math.random() * 450 + 150;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x >= (MAXCOLS + 2) * XSIDE) {
      this.x = - 3 * XSIDE;
      this.speed = this.getRandomSpeed();
    } else {
      this.x += this.speed * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  // Initial player's position
  this.newGame();
  // Helps to load the image
  this.sprite = 'images/char-boy.png';
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function() {
  // Player reachs goal
  if (this.y <= 0) {
    this.x = Math.floor(MAXCOLS / 2) * XSIDE;
    this.y = YSTARTPLAYER + (MAXROWS - 2) * YSIDE;
    this.score += 100;
  }
  // Player hits an enemy
  allEnemies.forEach(function(enemy) {
    if (this.y - YSTARTPLAYER === enemy.y - YSTARTENEMY && (this.x > enemy.x - XSIDE / 1.75 && this.x < enemy.x + XSIDE / 1.75)) {
      this.x = Math.floor(MAXCOLS / 2) * XSIDE;
      this.y = YSTARTPLAYER + (MAXROWS - 2) * YSIDE;
      this.lives --;

    }
  }.bind(this));
  // Player has 0 lives, hide player
  if (player.lives <= 0) {
    player.x = - XSIDE;
  }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.font = "21pt sans-serif";
  ctx.lineWidth = 1;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillRect(0, 0, 707, 40);
  ctx.strokeText("Score: " + this.score, 30, 30);
  ctx.strokeText("Lives: " + this.lives, 570, 30);
  // Player has 0 lives, write message
  if (this.lives <= 0) {
    ctx.font = "63pt sans-serif";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";
    ctx.strokeText("Game Over!", MAXCOLS * XSIDE / 2, MAXROWS * YSIDE / 1.75);
    ctx.fillText("Game Over!", MAXCOLS * XSIDE / 2, MAXROWS * YSIDE / 1.75);
    ctx.font = "28pt sans-serif";
    ctx.strokeText("Pres any key to start a new game.", MAXCOLS * XSIDE / 2, MAXROWS * YSIDE / 1.75 + 60);
    ctx.fillText("Pres any key to start a new game.", MAXCOLS * XSIDE / 2, MAXROWS * YSIDE / 1.75 + 60);
  }
};

// Move the player across the screen
Player.prototype.handleInput = function(key) {
  if (this.lives > 0) {
    switch (key) {
      case 'left':
        if (this.x > 0) {
          this.x -= XSIDE;
        }
        break;
      case 'up':
        if (this.y > 0) {
          this.y -= YSIDE;
        }
        break;
      case 'right':
        if (this.x < (MAXCOLS - 1) * XSIDE) {
          this.x += XSIDE;
        }
        break;
      case 'down':
        if (this.y < YSTARTPLAYER + (MAXROWS - 2) * YSIDE) {
          this.y += YSIDE;
        }
        break;
    }
  // Player has 0 lives, start new game
  } else {
    this.newGame();
  }
};

// Start new game
Player.prototype.newGame = function() {
  this.x = Math.floor(MAXCOLS / 2) * XSIDE;
  this.y = YSTARTPLAYER + (MAXROWS - 2) * YSIDE;
  this.lives = 3;
  this.score = 0;
};

// Items our player can take
var Item = function() {
  this.prob = 1/3;
  this.appear();
  this.sprite = 'images/Gem Green.png';
};

// Update the item's position
Item.prototype.update = function() {
  // Player takes an item
  if (player.y - YSTARTPLAYER === this.y - YSTARTITEM && player.x === this.x) {
    this.y = - 3 * YSIDE;
    player.score += 100;
  }
};

// Draw the item on the screen
Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Show an item according to its probability
Item.prototype.appear = function() {
  // Why is 'this.prob' undefinied? How can I access to it?
  if (this.prob >= Math.random()) {
    this.x = this.getRandomLocation(MAXCOLS, XSIDE, 0);
    this.y = this.getRandomLocation(MAXROWS - 2, YSIDE, YSTARTITEM);
  }
};

// Set a different location for each item
Item.prototype.getRandomLocation = function(max, side, start) {
  return (Math.floor(Math.random() * max)) * side + start;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemyA1 = new Enemy(YSTARTENEMY + YSIDE * 4);
var enemyA2 = new Enemy(YSTARTENEMY + YSIDE * 4);
var enemyB1 = new Enemy(YSTARTENEMY + YSIDE * 3);
var enemyB2 = new Enemy(YSTARTENEMY + YSIDE * 3);
var enemyC1 = new Enemy(YSTARTENEMY + YSIDE * 2);
var enemyC2 = new Enemy(YSTARTENEMY + YSIDE * 2);
var enemyD1 = new Enemy(YSTARTENEMY + YSIDE * 1);
var enemyD2 = new Enemy(YSTARTENEMY + YSIDE * 1);
var enemyE1 = new Enemy(YSTARTENEMY);
var enemyE2 = new Enemy(YSTARTENEMY);
var allEnemies = [enemyA1, enemyA2, enemyB1, enemyB2, enemyC1, enemyC2, enemyD1, enemyD2, enemyE1, enemyE2];
// Place the player object in a variable called player
var player = new Player();
// Place the item object in a variable called item
var item = new Item();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
