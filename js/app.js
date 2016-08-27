// Global variables
const maxRows = 7;
const maxCols = 7;
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

// Set a different speed (between 150 and 600) for each enemy's ride
function getRandomSpeed() {
  return Math.random() * 450 + 150
};

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
  this.newGame();
  // Helps to load the image
  this.sprite = 'images/char-boy.png';
}

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function() {
  // Player reachs goal
  if (this.y <= 0) {
    this.x = Math.floor(maxCols / 2) * xSide;
    this.y = yStartPlayer + (maxRows - 2) * ySide;
    this.score += 100;
  }
  // Player hits an enemy
  allEnemies.forEach(function(enemy) {
    if (player.y - yStartPlayer === enemy.y - yStartEnemy && (player.x > enemy.x - xSide / 1.75 && player.x < enemy.x + xSide / 1.75)) {
      player.x = Math.floor(maxCols / 2) * xSide;
      player.y = yStartPlayer + (maxRows - 2) * ySide;
      player.lives --;

    }
  });
  // Player has 0 lives, hide player
  if (player.lives <= 0) {
    player.x = - xSide;
  }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.font = "21pt sans-serif"
  ctx.lineWidth = 1;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillRect(0, 0, 707, 40);
  ctx.strokeText("Score: " + this.score, 30, 30);
  ctx.strokeText("Lives: " + this.lives, 570, 30);
  // Player has 0 lives, write message
  if (player.lives <= 0) {
    ctx.font = "63pt sans-serif";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";
    ctx.strokeText("Game Over!", maxCols * xSide / 2, maxRows * ySide / 1.75);
    ctx.fillText("Game Over!", maxCols * xSide / 2, maxRows * ySide / 1.75);
    ctx.font = "28pt sans-serif";
    ctx.strokeText("Pres any key to start a new game.", maxCols * xSide / 2, maxRows * ySide / 1.75 + 60);
    ctx.fillText("Pres any key to start a new game.", maxCols * xSide / 2, maxRows * ySide / 1.75 + 60);
  }
};

// Move the player across the screen
Player.prototype.handleInput = function(key) {
  if (this.lives > 0) {
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
  // Player has 0 lives, start new game
  } else {
    this.newGame();
  }
};

// Start new game
Player.prototype.newGame = function() {
  this.x = Math.floor(maxCols / 2) * xSide;
  this.y = yStartPlayer + (maxRows - 2) * ySide;
  this.lives = 3;
  this.score = 0;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemyA1 = new Enemy(yStartEnemy + ySide * 4);
var enemyA2 = new Enemy(yStartEnemy + ySide * 4);
var enemyB1 = new Enemy(yStartEnemy + ySide * 3);
var enemyB2 = new Enemy(yStartEnemy + ySide * 3);
var enemyC1 = new Enemy(yStartEnemy + ySide * 2);
var enemyC2 = new Enemy(yStartEnemy + ySide * 2);
var enemyD1 = new Enemy(yStartEnemy + ySide * 1);
var enemyD2 = new Enemy(yStartEnemy + ySide * 1);
var enemyE1 = new Enemy(yStartEnemy);
var enemyE2 = new Enemy(yStartEnemy);
var allEnemies = [enemyA1, enemyA2, enemyB1, enemyB2, enemyC1, enemyC2, enemyD1, enemyD2, enemyE1, enemyE2];
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
