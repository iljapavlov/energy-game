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
var currentSelected = null; // Reference to the currently selected tile
var cursors; // To hold the cursor keys
var tiles = []; // 2D array of tiles

function preload() {
}

var moneyText; // To update the money display dynamically

function create() {
    const tileSize = 40;
    const types = ['green', 'grey'];

    // Creating the top bar
    this.add.rectangle(0, 0, 800, 40, 0x333333).setOrigin(0);

    // Create tiles
    for (let i = 0; i < 10; i++) {
        tiles[i] = [];
        for (let j = 0; j < 10; j++) {
            let color = Phaser.Utils.Array.GetRandom(types);
            let hexColor = mapColorToHex(color);
            let tile = this.add.rectangle(100 + j * tileSize, 100 + i * tileSize, tileSize, tileSize, hexColor).setInteractive();

            tile.on('pointerdown', function () {
                selectTile(i, j);
            });

            tiles[i][j] = tile;
        }
    }

    // Initial selection
    selectTile(0, 0);

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

function mapColorToHex(color) {
    switch (color) {
        case 'green': return 0x008000;
        case 'grey': return 0x808080;
        default: return 0xFFFFFF;
    }
}

function createColorButton(scene, x, y, color, label, cost) {
    let button = scene.add.rectangle(x, y, 80, 30, color).setInteractive();
    let costText = ' - $' + cost;
    scene.add.text(x + 45, y - 8, label + costText, { color: '#ffffff', fontSize: '16px' }).setOrigin(0.5);

    button.on('pointerdown', function () {
        if (currentSelected && money >= cost) {
            currentSelected.setFillStyle(color, 1);
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
    if (currentSelected) {
        let i = currentSelected.i;
        let j = currentSelected.j;
        let newI = i + y;
        let newJ = j + x;

        if (newI >= 0 && newI < 10 && newJ >= 0 && newJ < 10) {
            selectTile(newI, newJ);
        }
    }
}

function selectTile(i, j) {
    if (currentSelected) {
        // Remove border from previously selected tile
        currentSelected.setStrokeStyle(0);
    }
    let tile = tiles[i][j];
    tile.setStrokeStyle(2, 0x00FF00); // Green border for selected tile
    currentSelected = tile;
    currentSelected.i = i;
    currentSelected.j = j;
}