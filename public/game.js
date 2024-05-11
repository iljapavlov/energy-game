import {Tile} from './Tile.js';
import { Sea } from './tiletypes/Sea.js';
import { Plains } from './tiletypes/Plains.js';
import { City } from './tiletypes/City.js';

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

var money = 10000; // Starting amount of money
var costs = {
    Blue: 100,
    Pink: 200,
    Yellow: 150,
    Green: 50
};


var game = new Phaser.Game(config);
var cursors; // To hold the cursor keys
var tiles = []; // 2D array of tiles

function preload() {
}

var moneyText; // To update the money display dynamically

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

    // Create buttons for changing tile color
    createColorButton(this, 800, 100, 0x0000FF, 'Blue'); // Blue button
    createColorButton(this, 800, 160, 0xFF1493, 'Pink'); // Pink button
    createColorButton(this, 800, 220, 0xFFFF00, 'Yellow'); // Yellow button
    createColorButton(this, 800, 280, 0x00FF00, 'Green'); // Green button

    // money related things
    moneyText = this.add.text(10, 20, 'Money: $' + money, { fontSize: '20px', fill: '#fff' });

    // Create buttons for changing tile color
    createColorButton(this, 800, 100, 0x0000FF, 'Blue', costs.Blue);
    createColorButton(this, 800, 160, 0xFF1493, 'Pink', costs.Pink);
    createColorButton(this, 800, 220, 0xFFFF00, 'Yellow', costs.Yellow);
    createColorButton(this, 800, 280, 0x00FF00, 'Green', costs.Green);

}



function createColorButton(scene, x, y, color, label, cost) {
    let button = scene.add.rectangle(x, y, 80, 30, color).setInteractive();
    let costText = ' - $' + cost;
    scene.add.text(x + 45, y - 8, label + costText, { color: '#ffffff', fontSize: '16px' }).setOrigin(0.5);

    button.on('pointerdown', function () {
        if (Tile.selectedTile && money >= cost) {
            Tile.selectedTile.tile.setFillStyle(color, 1);
            money -= cost;
            updateMoneyDisplay();
        }
    });
}

function updateMoneyDisplay() {
    moneyText.setText('Money: $' + money);
}

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

