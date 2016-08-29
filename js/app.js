'use strict';

// Global variables
var constants = {
    MAX_ROWS: 7,
    MAX_COLS: 7,
    X_SIDE: 101,
    Y_SIDE: 83,
    Y_START_PLAYER: 72,
    Y_START_ENEMY: 62,
    Y_START_ITEM: 52
};

// Enemies our player must avoid
var Enemy = function(yRow) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = - 3 * constants.X_SIDE;
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
    if (this.x >= (constants.MAX_COLS + 2) * constants.X_SIDE) {
        this.x = - 3 * constants.X_SIDE;
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
        this.x = Math.floor(constants.MAX_COLS / 2) * constants.X_SIDE;
        this.y = constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE;
        this.score += 100;
        gem.appear();
        heart.appear();
    }
    // Player hits an enemy
    allEnemies.forEach(function(enemy) {
        if (this.y - constants.Y_START_PLAYER === enemy.y - constants.Y_START_ENEMY && (this.x > enemy.x - constants.X_SIDE / 1.75 && this.x < enemy.x + constants.X_SIDE / 1.75)) {
            this.x = Math.floor(constants.MAX_COLS / 2) * constants.X_SIDE;
            this.y = constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE;
            this.lives --;

        }
    }.bind(this));
    // Player has 0 lives, hide player
    if (this.lives <= 0) {
        this.x = - constants.X_SIDE;
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
        ctx.strokeText("Game Over!", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75);
        ctx.fillText("Game Over!", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75);
        ctx.font = "28pt sans-serif";
        ctx.strokeText("Pres any key to start a new game.", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75 + 60);
        ctx.fillText("Pres any key to start a new game.", constants.MAX_COLS * constants.X_SIDE / 2, constants.MAX_ROWS * constants.Y_SIDE / 1.75 + 60);
    }
};

// Move the player across the screen
Player.prototype.handleInput = function(key) {
    if (this.lives > 0) {
        switch (key) {
            case 'left':
            if (this.x > 0) {
                this.x -= constants.X_SIDE;
            }
            break;
            case 'up':
            if (this.y > 0) {
                this.y -= constants.Y_SIDE;
            }
            break;
            case 'right':
            if (this.x < (constants.MAX_COLS - 1) * constants.X_SIDE) {
                this.x += constants.X_SIDE;
            }
            break;
            case 'down':
            if (this.y < constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE) {
                this.y += constants.Y_SIDE;
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
    this.x = Math.floor(constants.MAX_COLS / 2) * constants.X_SIDE;
    this.y = constants.Y_START_PLAYER + (constants.MAX_ROWS - 2) * constants.Y_SIDE;
    this.lives = 3;
    this.score = 0;
};

// Items our player can take
var Item = function() {

};

// Draw the item on the screen
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Show an item according to its probability
Item.prototype.appear = function() {
    if (this.prob >= Math.random()) {
        this.x = this.getRandomLocation(constants.MAX_COLS, constants.X_SIDE, 0);
        this.y = this.getRandomLocation(constants.MAX_ROWS - 2, constants.Y_SIDE, constants.Y_START_ITEM);
    }
};

// Set a different location for each item
Item.prototype.getRandomLocation = function(max, side, start) {
    return (Math.floor(Math.random() * max)) * side + start;
};

var Gem = function() {
    this.prob = 1/3;
    this.sprite = 'images/Gem Green.png';
};
// Gem is a subclass of Item
Gem.prototype = Object.create(Item.prototype);
// Retrieving Gem's constructor
Gem.prototype.constructor = Gem;

// Update the gem's position
Gem.prototype.update = function() {
    // Player takes the gem
    if (player.y - constants.Y_START_PLAYER === this.y - constants.Y_START_ITEM && player.x === this.x) {
        this.y = - 3 * constants.Y_SIDE;
        player.score += 100;
    }
};

var Heart = function() {
    this.prob = 1/10;
    this.sprite = 'images/Heart.png';
};
// Heart is a subclass of Item
Heart.prototype = Object.create(Item.prototype);
// Retrieving Heart's constructor
Heart.prototype.constructor = Heart;

// Update heart's position
Heart.prototype.update = function() {
    // Player takes the heart
    if (player.y - constants.Y_START_PLAYER === this.y - constants.Y_START_ITEM && player.x === this.x) {
        this.y = - 3 * constants.Y_SIDE;
        player.lives ++;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemyA1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 4);
var enemyA2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 4);
var enemyB1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 3);
var enemyB2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 3);
var enemyC1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 2);
var enemyC2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 2);
var enemyD1 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 1);
var enemyD2 = new Enemy(constants.Y_START_ENEMY + constants.Y_SIDE * 1);
var enemyE1 = new Enemy(constants.Y_START_ENEMY);
var enemyE2 = new Enemy(constants.Y_START_ENEMY);
var allEnemies = [enemyA1, enemyA2, enemyB1, enemyB2, enemyC1, enemyC2, enemyD1, enemyD2, enemyE1, enemyE2];
// Place the player object in a variable called player
var player = new Player();
// Place the items object in variables called gem and heart
var gem = new Gem();
var heart = new Heart();

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
