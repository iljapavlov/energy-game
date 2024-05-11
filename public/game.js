/**
 * @file game.js
 * This file contains the main game logic for a tile-based game.
 * It uses the Phaser game framework and includes the creation of the game scene, game objects, and game logic.
 */

// Import necessary modules and classes
import {Tile} from './Tile.js';
import { Sea } from './tiletypes/Sea.js';
import { Plains } from './tiletypes/Plains.js';
import { City } from './tiletypes/City.js';
import {TransactionHistory} from './TransactionHistory.js';

/**
 * Configuration object for the Phaser game.
 * Includes the type of renderer to use, the dimensions of the game, the parent HTML element, the game scene, and the background color.
 */
var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: "#242424",
};

/**
 * The player's starting amount of money.
 */
var money = 10000;

/**
 * The costs of different colors in the game.
 */
var costs = {
    Blue: 100,
    Pink: 200,
    Yellow: 150,
    Green: 50
};

/**
 * The Phaser game instance.
 */
var game = new Phaser.Game(config);

// Other game variables
var cursors; // To hold the cursor keys
var tiles = []; // 2D array of tiles
var gameTimer;
var paused = true;
var dayCounter = 0;
let transactionHistory;

/**
 * The preload function is part of the Phaser game lifecycle and is used to load assets.
 */
function preload() {
}

var moneyText; // To update the money display dynamically
var timeText; // To update the time display dynamically

/**
 * The create function is part of the Phaser game lifecycle and is used to set up the game scene.
 */
function create() {
    const tileSize = 40;
    const types = ['Plains', 'City', 'Sea'];

    // Creating the top bar
    this.add.rectangle(0, 0, 800, 40, 0x333333).setOrigin(0);

    // Create tiles
    for (let i = 0; i < 10; i++) {
        tiles[i] = [];
        for (let j = 0; j < 10; j++) {
            let type = Phaser.Utils.Array.GetRandom(types);
            let tile;
            switch (type) {
                case 'Plains':
                    tile = new Plains(this, i, j, tileSize);
                    break;
                case 'City':
                    tile = new City(this, i, j, tileSize);
                    break;
                case 'Sea':
                    tile = new Sea(this, i, j, tileSize);
                    break;
                default:
                    tile = new Tile(this, i, j, type, tileSize);
                    break;
            }
            tiles[i][j] = tile;
        }
    }

    // Initial selection
    tiles[0][0].select();

    // Capture keyboard arrows
    cursors = this.input.keyboard.createCursorKeys();

    // money related things
    moneyText = this.add.text(10, 20, 'Money: $' + money, { fontSize: '20px', fill: '#fff' });
    // Initialize the transaction history
    transactionHistory = new TransactionHistory();
    transactionHistory.addTransaction(money, 'income', 'Initial money')


    // Create buttons for changing tile color
    createColorButton(this, 800, 100, 0x0000FF, 'Blue', costs.Blue);
    createColorButton(this, 800, 160, 0xFF1493, 'Pink', costs.Pink);
    createColorButton(this, 800, 220, 0xFFFF00, 'Yellow', costs.Yellow);
    createColorButton(this, 800, 280, 0x00FF00, 'Green', costs.Green);

    // Create a looped timer event that triggers every second
    gameTimer = this.time.addEvent({ delay: 1000, callback: onTick, callbackScope: this, loop: true });
    // Add keyboard inputs for pausing and resuming the game
    this.input.keyboard.on('keydown-P', pauseGame, this);
    this.input.keyboard.on('keydown-R', resumeGame, this);
    timeText = this.add.text(300, 20, 'Day: ' + dayCounter, { fontSize: '20px', fill: '#fff' });



}

/**
 * The onTick function is called every second and represents the game logic that should happen every tick.
 */
function onTick() {
    // Logic that should happen every tick
    // For example, decrease money every tick:
    if (!paused) {
        transactionHistory.addTransaction(10, 'expense', 'Daily expense');
        updateMoneyDisplay();
        dayCounter++;
        updateTimeDisplay();
    }
}

/**
 * The pauseGame function is used to pause the game.
 */
function pauseGame() {
    paused = true;
    gameTimer.paused = true;
}

/**
 * The resumeGame function is used to resume the game.
 */
function resumeGame() {
    paused = false;
    gameTimer.paused = false;
}

/**
 * The createColorButton function is used to create a button that the player can interact with to change the color of the selected tile.
 * @param {Phaser.Scene} scene - The current game scene.
 * @param {number} x - The x-coordinate of the button.
 * @param {number} y - The y-coordinate of the button.
 * @param {number} color - The color of the button.
 * @param {string} label - The label of the button.
 * @param {number} cost - The cost of the color.
 */
function createColorButton(scene, x, y, color, label, cost) {
    let button = scene.add.rectangle(x, y, 80, 30, color).setInteractive();
    let costText = ' - $' + cost;
    scene.add.text(x + 45, y - 8, label + costText, { color: '#ffffff', fontSize: '16px' }).setOrigin(0.5);

    button.on('pointerdown', function () {
        if (Tile.selectedTile && transactionHistory.getBalance() >= cost) {
            Tile.selectedTile.tile.setFillStyle(color, 1);
            transactionHistory.addTransaction(cost, 'expense', `Bought ${label} color`);
            updateMoneyDisplay();
        }
    });
}

/**
 * The updateMoneyDisplay function is used to update the display of the player's money.
 */
function updateMoneyDisplay() {
    moneyText.setText('Money: $' + transactionHistory.getBalance());
}

/**
 * The updateTimeDisplay function is used to update the display of the current day.
 */
function updateTimeDisplay() {
    timeText.setText('Day: ' + dayCounter);
}

/**
 * The update function is part of the Phaser game lifecycle and is called every frame to update the game state.
 */
function update() {
    if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        updateSelection(-1, 0);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        updateSelection(1, 0);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        updateSelection(0, -1);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
        updateSelection(0, 1);
    }
}

/**
 * The updateSelection function is used to update the selected tile based on keyboard inputs.
 * @param {number} x - The change in the x-coordinate of the selected tile.
 * @param {number} y - The change in the y-coordinate of the selected tile.
 */
function updateSelection(x, y) {
    if (Tile.selectedTile) {
        let i = Tile.selectedTile.i;
        let j = Tile.selectedTile.j;
        let newI = i + y;
        let newJ = j + x;

        if (newI >= 0 && newI < 10 && newJ >= 0 && newJ < 10) {
            tiles[newI][newJ].select();
        }
    }
}

