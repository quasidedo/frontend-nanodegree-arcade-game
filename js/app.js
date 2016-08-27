// Global variables
const maxRows = 6;
const maxCols = 5;
const xSide = 101;
const ySide = 83;
const yStartPlayer = 72;
const yStartEnemy = 62;

// Enemies our player must avoid
var Enemy = function(yRow) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = - 3 * xSide;
    this.y = yRow;
    this.speed = getRandomSpeed();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Set a different speed for each enemy's ride
function getRandomSpeed() {
  return Math.random() * 450 + 50
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x >= (maxCols + 2) * xSide) {
      this.x = - 3 * xSide;
      this.speed = getRandomSpeed();
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
  this.x = Math.floor(maxCols / 2) * xSide;
  this.y = yStartPlayer + (maxRows - 2) * ySide;
  // Helps to load the image
  this.sprite = 'images/char-boy.png';
}

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function() {
  if (this.y <= 0) {
    this.x = Math.floor(maxCols / 2) * xSide;
    this.y = yStartPlayer + (maxRows - 2) * ySide;
  }
  allEnemies.forEach(function(enemy) {
    if (player.y - yStartPlayer === enemy.y - yStartEnemy && (player.x > enemy.x - xSide / 1.75 && player.x < enemy.x + xSide / 1.75)) {
      player.x = Math.floor(maxCols / 2) * xSide;
      player.y = yStartPlayer + (maxRows - 2) * ySide;
    }
  });
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Move the player across the screen
Player.prototype.handleInput = function(key) {
  switch (key) {
    case 'left':
      if (this.x > 0) {
        this.x -= xSide;
      }
      break;
    case 'up':
      if (this.y > 0) {
        this.y -= ySide;
      }
      break;
    case 'right':
      if (this.x < (maxCols - 1) * xSide) {
        this.x += xSide;
      }
      break;
    case 'down':
      if (this.y < yStartPlayer + (maxRows - 2) * ySide) {
        this.y += ySide;
      }
      break;
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemyA1 = new Enemy(yStartEnemy + ySide * 2);
var enemyA2 = new Enemy(yStartEnemy + ySide * 2);
var enemyB1 = new Enemy(yStartEnemy + ySide * 1);
var enemyB2 = new Enemy(yStartEnemy + ySide * 1);
var enemyC1 = new Enemy(yStartEnemy);
var enemyC2 = new Enemy(yStartEnemy);
var allEnemies = [enemyA1, enemyA2, enemyB1, enemyB2, enemyC1, enemyC2];
// Place the player object in a variable called player
var player = new Player;

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
