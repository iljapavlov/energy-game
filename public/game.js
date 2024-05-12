/**
 * @file game.js
 * This file contains the main game logic for a tile-based game.
 * It uses the Phaser game framework and includes the creation of the game scene, game objects, and game logic.
 */

// Import necessary modules and classes
import {Tile} from './Tile.js';
import {TransactionHistory} from './TransactionHistory.js';
import {House} from './tiletypes/powerConsumer/House.js';
import {Plains} from './tiletypes/terrain/Plains.js';
import {Sea} from './tiletypes/terrain/Sea.js';
import {SolarPanel} from './tiletypes/powerProducers/renewable/SolarPanel.js';
import {EleringDataFetcher} from './EleringDataFetcher.js';
import {PowerConsumer} from "./tiletypes/powerConsumer/PowerConsumer.js";
import {Connector} from "./tiletypes/powerConnector/Connector.js";
import {HouseBattery} from "./tiletypes/powerConsumer/HouseBattery.js";
import {HouseSolar} from "./tiletypes/powerConsumer/HouseSolar.js";
import {HouseSolarBattery} from "./tiletypes/powerConsumer/HouseSolarBattery.js";
import {Coal} from "./tiletypes/powerProducers/fossil/Coal.js";
import {Gas} from "./tiletypes/powerProducers/fossil/Gas.js";
import {Geothermal} from "./tiletypes/powerProducers/renewable/Geothermal.js";
import {Hydro} from "./tiletypes/powerProducers/renewable/Hydro.js";
import {Biomass} from "./tiletypes/powerProducers/renewable/Biomass.js";
import {Nuclear} from "./tiletypes/powerProducers/fossil/Nuclear.js";
import {Tidal} from "./tiletypes/powerProducers/renewable/Tidal.js";
import {Windmill} from "./tiletypes/powerProducers/renewable/Windmill.js";
import {ChemicalBattery} from "./tiletypes/powerStorage/ChemicalBattery.js";
import {Forest} from "./tiletypes/terrain/Forest.js";
import {levelDesigns} from "./levelDesigns.js";

/**
 * Configuration object for the Phaser game.
 * Includes the type of renderer to use, the dimensions of the game, the parent HTML element, the game scene, and the background color.
 */
var config = {
    type: Phaser.AUTO, width: 900, height: 600, parent: 'game', scene: {
        preload: preload, create: create, update: update
    }, backgroundColor: "#242424",
};

/**
 * The player's starting amount of money.
 */
var money = 10000;

/**
 * The costs of different colors in the game.
 */
var costs = {
    Blue: 100, Pink: 200, Yellow: 150, Green: 50
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
let transactionHistory;
let eleringDataFetcher;

let HOURLY_CONSUMPTION = [];
let HOURLY_PRODUCTION = [];

var hourCounter = 0;

var moneyText; // To update the money display dynamically
var timeText; // To update the time display dynamically
// var consumptionText;
// var productionText;
var electricityText;

const getCurrentConsumption = () => {
    return HOURLY_CONSUMPTION[hourCounter % HOURLY_CONSUMPTION.length] * PowerConsumer.houseCount;
}
const getCurrentProduction = () => {
    return HOURLY_PRODUCTION[hourCounter % HOURLY_PRODUCTION.length] * getNumberOfTileColor('aqua');
}
const getNumberOfTileColor = (tileColor) => {
    return tiles.flat().filter(tile => tile.color === tileColor).length;
}
const getCurrentElectricityPrice = (production, consumption) => {
    const BASE_ELECTRICITTY_PRICE = 0.1; // TODO change this

    let price_multiplier;
    if (consumption > production) {
        price_multiplier = 1 + (consumption - production) / (production + 1e-4);
    } else {
        price_multiplier = 1 - (production - consumption) / (production + 1e-4);
    }
    console.log(price_multiplier, 'multipl', price_multiplier*BASE_ELECTRICITTY_PRICE, 'price')
    console.log(production, consumption)
    const finalPrice = Math.max(price_multiplier * BASE_ELECTRICITTY_PRICE, BASE_ELECTRICITTY_PRICE);
    return finalPrice.toFixed(3);
}

let currentConsumption = getCurrentConsumption();
let currentProduction = getCurrentProduction();
let currentElectricityPrice = getCurrentElectricityPrice(currentConsumption, currentProduction);

console.log('current elect price calc', currentConsumption, currentProduction, currentElectricityPrice);

/**
 * The preload function is part of the Phaser game lifecycle and is used to load assets.
 */
function preload() {
    // Load hosue image
    this.load.image('house', './img/house.png');
    this.load.image('house-night', './img/house-night.png');
    this.load.image('house-solar', './img/house-solar.png');
    this.load.image('solar-panel', './img/solar-panel.png');
    this.load.image('tower', './img/tower.png');
    this.load.image('water', './img/water.png');
    this.load.image('battery-100', './img/battery-100.png');
    this.load.image('power-plant-on', './img/power-plant-on.png');
    this.load.image('grass', './img/grass.png');
    // this.load.spritesheet('wire', './img/wire-3.png', {frameWidth:972,frameHeight:318, endFrame:5});
    // this.load.image('wire-straight', './img/wires/wire-straight.png');
    // this.load.image('wire-angle', './img/wires/wire-angle.png');
    // this.load.image('wire-sumo-pants', './img/wires/wire-sumo-pants.png');
    // this.load.image('wire-connection', './img/wires/wire-connection.png');
}

/**
 * The create function is part of the Phaser game lifecycle and is used to set up the game scene.
 */
function create() {
    const types = ["Connector", "House", "HouseBattery", "HouseSolar", "HouseSolarBattery", "Coal", "Gas", "Nuclear", "Biomass", "Geothermal", "Hydro", "SolarPanel", "Tidal", "Windmill", "ChemicalBattery", "GravityBattery", "Forest", "Mountain", "Plains", "Sea"];
    
    var levelDesign = levelDesigns.level3
    
    initializeDataFetcher().then(() => {
        console.log("Prod: " + HOURLY_PRODUCTION);
        console.log("Cons: " + HOURLY_CONSUMPTION);
    });
    // Creating the top bar
    this.add.rectangle(0, 0, 800, 40, 0x333333).setOrigin(0);

    // Create tiles
    for (let i = 0; i < 10; i++) {
        tiles[i] = [];
        for (let j = 0; j < 10; j++) {
            let type = levelDesign[i][j];
            let tile;
            switch (type) {
                case 'Connector':
                    tile = new Connector(this, i, j);
                    break;
                case 'House':
                    tile = new House(this, i, j);
                    break;
                case 'HouseBattery':
                    tile = new HouseBattery(this, i, j);
                    break;
                case 'HouseSolar':
                    tile = new HouseSolar(this, i, j);
                    break;
                case 'HouseSolarBattery':
                    tile = new HouseSolarBattery(this, i, j);
                    break;
                case 'Coal':
                    tile = new Coal(this, i, j);
                    break;
                case 'Gas':
                    tile = new Gas(this, i, j);
                    break;
                case 'Nuclear':
                    tile = new Nuclear(this, i, j);
                    break;
                case 'Biomass':
                    tile = new Biomass(this, i, j);
                    break;
                case 'Geothermal':
                    tile = new Geothermal(this, i, j);
                    break;
                case 'Hydro':
                    tile = new Hydro(this, i, j);
                    break;
                case 'SolarPanel':
                    tile = new SolarPanel(this, i, j);
                    break;
                case 'Tidal':
                    tile = new Tidal(this, i, j);
                    break;
                case 'Windmill':
                    tile = new Windmill(this, i, j);
                    break;
                case 'ChemicalBattery':
                    tile = new ChemicalBattery(this, i, j);
                    break;
                case 'GravityBattery':
                    tile = new ChemicalBattery(this, i, j);
                    break;
                case 'Forest':
                    tile = new Forest(this, i, j);
                    break;
                case 'Mountain':
                    tile = new Mountain(this, i, j);
                    break;
                case 'Plains':
                    tile = new Plains(this, i, j);
                    break;
                case 'Sea':
                    tile = new Sea(this, i, j);
                    break;
                default:
                    tile = new Tile(this, i, j, "red");
                    break;
            }
            tiles[i][j] = tile;
        }
    }

    // Update Connector Tile appearances
    // for (let i = 0; i < tiles.length; i++) {
    //     for (let j = 0; j < tiles[i].length; j++) {
    //         if (tiles[i][j] instanceof Connector) {
    //             tiles[i][j].updateAppearance();
    //         }
    //     }
    // }

    // Draw wiring

    /**
     * Draws wiring between connectors and their neighboring tiles if they are not "Sea", "Plains", or "Forest".
     * @param {Phaser.Scene} scene - The current game scene.
     * @param {number} i - The row index of the tile.
     * @param {number} j - The column index of the tile.
     * @param {Array<Array<string>>} map - The map grid representing tile types.
     */
    function drawWiring(scene, i, j, map) {
        const directions = [
            { di: -1, dj: 0 }, // Up
            { di: 1, dj: 0 },  // Down
            { di: 0, dj: -1 }, // Left
            { di: 0, dj: 1 }   // Right
        ];

        const baseX = 75; // Base X-coordinate for the tiles
        const baseY = 75; // Base Y-coordinate for the tiles
        const tileSize = Tile.TILE_SIZE;
        const wireWidth = 4; // Width of the wire

        const centerX = baseX + j * tileSize + tileSize / 2;
        const centerY = baseY + i * tileSize + tileSize / 2;

        const tileName = map[i][j];

        directions.forEach(({ di, dj }) => {
            const ni = i + di;
            const nj = j + dj;

            if (ni >= 0 && ni < map.length && nj >= 0 && nj < map[0].length) { //boundaries
                const neighbour = map[ni][nj];

                if ((!['Sea', 'Plains', 'Forest'].includes(tileName)) && (!['Sea', 'Plains', 'Forest'].includes(neighbour))){
                    const neighborCenterX = baseX + nj * tileSize + tileSize / 2;
                    const neighborCenterY = baseY + ni * tileSize + tileSize / 2;

                    // Calculate angle and distance for the wire
                    const angle = Math.atan2(neighborCenterY - centerY, neighborCenterX - centerX);
                    const distance = Phaser.Math.Distance.Between(centerX, centerY, neighborCenterX, neighborCenterY);

                    // Create a rectangle (wire) rotated to connect centers
                    const wire = scene.add.rectangle(centerX, centerY, distance, wireWidth, 0x314a26)
                        .setOrigin(0, 0.5)
                        .setAngle(Phaser.Math.RadToDeg(angle))
                        .setDepth(0);
                }
            }
        });
    }


    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (!([Sea, Plains, Forest].some(c => tiles[i][j] instanceof c))) {
                drawWiring(this, i, j, levelDesign);
            }
        }
    }

    // Initial selection
    tiles[0][0].select();

    // Capture keyboard arrows
    cursors = this.input.keyboard.createCursorKeys();

    // money related things
    moneyText = this.add.text(10, 20, 'Money: €' + money, {fontSize: '20px', fill: '#fff'});
    // Initialize the transaction history
    transactionHistory = new TransactionHistory();
    transactionHistory.addTransaction(money, 'income', 'Initial money')


    // Create buttons for changing tile color
    createColorButton(this, 800, 100, 0x0000FF, 'Blue', costs.Blue);
    createColorButton(this, 800, 160, 0xFF1493, 'Pink', costs.Pink);
    createColorButton(this, 800, 220, 0xFFFF00, 'Yellow', costs.Yellow);
    createColorButton(this, 800, 280, 0x00FF00, 'Green', costs.Green);

    // Create a looped timer event that triggers every second
    gameTimer = this.time.addEvent({delay: 1000, callback: onTick, callbackScope: this, loop: true});
    // Add keyboard inputs for pausing and resuming the game
    this.input.keyboard.on('keydown-P', pauseGame, this);
    this.input.keyboard.on('keydown-R', resumeGame, this);
    timeText = this.add.text(300, 20, 'Hour: ' + hourCounter, {fontSize: '18px', fill: '#fff'});

    // consumptionText = this.add.text(500, 20, 'Consumption: ' + currentConsumption, { fontSize: '18px', fill: '#fff' });
    // productionText = this.add.text(700, 20, 'Production: ' + currentProduction, { fontSize: '18px', fill: '#fff' });
    electricityText = this.add.text(500, 20, 'Electricity price: ' + currentElectricityPrice, {
        fontSize: '18px', fill: '#fff'
    });
}

/**
 * The onTick function is called every second and represents the game logic that should happen every tick.
 */
function onTick() {
    // Logic that should happen every tick
    // For example, decrease money every tick:
    if (!paused) {
        hourCounter++;
        currentConsumption = getCurrentConsumption();
        // consumptionText.setText('Consumption: ' + currentConsumption);

        currentProduction = getCurrentProduction();
        // productionText.setText('Production: ' + currentProduction);

        console.log('curr cons prod', currentConsumption, currentProduction);
        currentElectricityPrice = getCurrentElectricityPrice(currentProduction, currentConsumption);
        electricityText.setText('Electricity price: ' + currentElectricityPrice + ' € / kWh');

        transactionHistory.addTransaction(currentConsumption, 'expense', 'Hourly expense');
        updateMoneyDisplay();
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
    scene.add.text(x + 45, y - 8, label + costText, {color: '#ffffff', fontSize: '16px'}).setOrigin(0.5);

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
    timeText.setText('Hour: ' + hourCounter);
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


async function initializeDataFetcher() {
    eleringDataFetcher = new EleringDataFetcher();
    await eleringDataFetcher.fetchData();

    for (let hour = 0; hour < 24; hour++) {
        HOURLY_CONSUMPTION[hour] = eleringDataFetcher.getConsumptionForHour(hour);
        HOURLY_PRODUCTION[hour] = eleringDataFetcher.getProductionForHour(hour);
    }
}
