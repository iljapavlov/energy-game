/**
 * @file game.js
 * This file contains the main game logic for a tile-based game.
 * It uses the Phaser game framework and includes the creation of the game scene, game objects, and game logic.
 */

// Import necessary modules and classes
import { EleringDataFetcher } from './EleringDataFetcher.js';
import { Tile } from './Tile.js';
import { TransactionHistory } from './TransactionHistory.js';
import { levelDesigns } from "./levelDesigns.js";
import { Connector } from "./tiletypes/powerConnector/Connector.js";
import { House } from './tiletypes/powerConsumer/House.js';
import { HouseSolar } from "./tiletypes/powerConsumer/HouseSolar.js";
import { PowerConsumer } from "./tiletypes/powerConsumer/PowerConsumer.js";
import { PowerProducer } from "./tiletypes/powerProducers/PowerProducer.js";
import { Coal } from "./tiletypes/powerProducers/fossil/Coal.js";
import { Gas } from "./tiletypes/powerProducers/fossil/Gas.js";
import { Nuclear } from "./tiletypes/powerProducers/fossil/Nuclear.js";
import { Biomass } from "./tiletypes/powerProducers/renewable/Biomass.js";
import { Geothermal } from "./tiletypes/powerProducers/renewable/Geothermal.js";
import { Hydro } from "./tiletypes/powerProducers/renewable/Hydro.js";
import { SolarPanel } from './tiletypes/powerProducers/renewable/SolarPanel.js';
import { Tidal } from "./tiletypes/powerProducers/renewable/Tidal.js";
import { Windmill } from "./tiletypes/powerProducers/renewable/Windmill.js";
import { ChemicalBattery } from "./tiletypes/powerStorage/ChemicalBattery.js";
import { GravityBattery } from "./tiletypes/powerStorage/GravityBattery.js";
import { HouseBattery } from "./tiletypes/powerStorage/HouseBattery.js";
import { HouseSolarBattery } from "./tiletypes/powerStorage/HouseSolarBattery.js";
import { PowerStorage } from "./tiletypes/powerStorage/PowerStorage.js";
import { Forest } from "./tiletypes/terrain/Forest.js";
import { Plains } from './tiletypes/terrain/Plains.js';
import { Sea } from './tiletypes/terrain/Sea.js';
import { WeatherManager } from './weather/WeatherManager.js';

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


var currentLevel = 'level1';

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
let weatherManager = null;

var moneyText; // To update the money display dynamically
var timeText; // To update the time display dynamically
// var consumptionText;
// var productionText;
var electricityText;
var gridPowerText;
var gridPower = 0;
let colorCharge = 0xDF9FF;
let colorDischarge = 0xFF9F9F;
let colorIdle = 0x9F9FFF;

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
    const BASE_ELECTRICITY_PRICE = 1; // Base price per MWh in dollars

    // Convert kWh to MWh for both production and consumption
    const productionMWh = production / 1000;
    const consumptionMWh = consumption / 1000;

    // Prevent division by zero by ensuring a minimum value for production and consumption
    const safeProductionMWh = Math.max(productionMWh, 0.001);
    const safeConsumptionMWh = Math.max(consumptionMWh, 0.001);

    // Calculate the net consumption (consumption - production)
    const netConsumptionMWh = consumptionMWh - productionMWh;

    // Determine the price multiplier based on the net consumption
    let priceMultiplier;
    if (netConsumptionMWh >= 0) {
        priceMultiplier = 1 + 0.1 * (netConsumptionMWh / safeProductionMWh);
    } else {
        priceMultiplier = 1 - 0.1 * (productionMWh / safeConsumptionMWh);
    }
    console.log(production, consumption)

    // Calculate the adjusted price
    const adjustedPrice = priceMultiplier * BASE_ELECTRICITY_PRICE;

    // Ensure the final price is not less than the base price and does not fall into negative
    const finalPrice = Math.max(adjustedPrice, BASE_ELECTRICITY_PRICE);

    // Return the final price rounded to three decimal places
    return finalPrice.toFixed(3);
};

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

    // Weather images
    this.load.image('sun', './img/weather/sun.png');
    this.load.image('moon', './img/weather/moon.png');
    this.load.image('cloudySun', './img/weather/cloudySun.png');
    this.load.image('storm', './img/weather/storm.png');

    // Chemical Battery Images
    this.load.image('battery-empty', './img/battery-statuses/battery_0.png');
    this.load.image('battery-one-bar', './img/battery-statuses/battery_25.png');
    this.load.image('battery-two-bars', './img/battery-statuses/battery_50.png');
    this.load.image('battery-three-bars', './img/battery-statuses/battery_75.png');
    this.load.image('battery-full', './img/battery-statuses/battery_100.png');
}

/**
 * The create function is part of the Phaser game lifecycle and is used to set up the game scene.
 */
function create() {

    initializeDataFetcher().then(() => {
        console.log("Prod: " + HOURLY_PRODUCTION);
        console.log("Cons: " + HOURLY_CONSUMPTION);
    });
    // Creating the top bar
    this.add.rectangle(0, 0, 800, 40, 0x333333).setOrigin(0);

    // Create tiles
    loadLevel('level1', this)

    // Capture keyboard arrows
    cursors = this.input.keyboard.createCursorKeys();

    // money related things
    moneyText = this.add.text(10, 20, 'Money: €' + money, {fontSize: '20px', fill: '#fff'});
    // Initialize the transaction history
    transactionHistory = new TransactionHistory();
    transactionHistory.addTransaction(money, 'income', 'Initial money')


    // Create a looped timer event that triggers every second
    gameTimer = this.time.addEvent({delay: 1000, callback: onTick, callbackScope: this, loop: true});
    // Add keyboard inputs for pausing and resuming the game
    this.input.keyboard.on('keydown-P', pauseGame, this);
    this.input.keyboard.on('keydown-R', resumeGame, this);
    timeText = this.add.text(300, 20, 'Hour: ' + hourCounter, {fontSize: '18px', fill: '#fff'});
    currentElectricityPrice = getCurrentElectricityPrice(currentProduction, currentConsumption);

    // consumptionText = this.add.text(500, 20, 'Consumption: ' + currentConsumption, { fontSize: '18px', fill: '#fff' });
    // productionText = this.add.text(700, 20, 'Production: ' + currentProduction, { fontSize: '18px', fill: '#fff' });
    electricityText = this.add.text(500, 20, 'Electricity price: ' + currentElectricityPrice, {
        fontSize: '18px', fill: '#fff'
    });

    gridPowerText = this.add.text(500, 40, 'Grid Power ' + gridPower, {
        fontSize: '18px', fill: '#fff'
    });


    // Step 1: Create a new container
    let buttonContainer = this.add.container(this.game.config.width - 100, this.game.config.height - 100);

    // Step 2: Create a few buttons
    let setToCharge = this.add.rectangle(0, 0, 80, 30, colorCharge).setInteractive();
    let setToDischarge = this.add.rectangle(0, -40, 80, 30, colorDischarge).setInteractive();
    let setToIdle = this.add.rectangle(0, -80, 80, 30, colorIdle).setInteractive();

    // Add text to the buttons
    let textCharge = this.add.text(0, 0, 'Charge', {color: '#000000', fontSize: '16px'}).setOrigin(0.5);
    let textDischarge = this.add.text(0, -40, 'Discharge', {color: '#000000', fontSize: '16px'}).setOrigin(0.5);
    let textIdle = this.add.text(0, -80, 'Idle', {color: '#000000', fontSize: '16px'}).setOrigin(0.5);

    // Step 3: Add the buttons and text to the container
    buttonContainer.add([setToCharge, setToDischarge, setToIdle, textCharge, textDischarge, textIdle]);

    // Step 4: Add event listeners to the buttons
    setToCharge.on('pointerdown', function () {
        if (Tile.selectedTile && Tile.selectedTile instanceof PowerStorage) {
            Tile.selectedTile.status = 'charging';
            Tile.selectedTile.bg.setFillStyle(colorCharge, 1);
        }
    });

    setToDischarge.on('pointerdown', function () {
        if (Tile.selectedTile && Tile.selectedTile instanceof PowerStorage) {
            Tile.selectedTile.status = 'discharging';
            Tile.selectedTile.bg.setFillStyle(colorDischarge, 1);
        }
    });

    setToIdle.on('pointerdown', function () {
        if (Tile.selectedTile && Tile.selectedTile instanceof PowerStorage) {
            Tile.selectedTile.status = 'idle';
            Tile.selectedTile.bg.setFillStyle(colorIdle, 1);
        }
    });

    // ALL THE WEATHER MANAGER STUFF
    weatherManager = new WeatherManager(this);

    // Level switching

    // Add the label
    this.add.text(600, 550, 'Level:', { fontSize: '32px', fill: '#fff' });

    // Add the buttons
    const level1Button = this.add.text(710, 550, '1', { fontSize: '32px', fill: '#fff' }).setInteractive();
    const level2Button = this.add.text(760, 550, '2', { fontSize: '32px', fill: '#fff' }).setInteractive();
    const level3Button = this.add.text(810, 550, '3', { fontSize: '32px', fill: '#fff' }).setInteractive();

    // Add click events to the buttons
    level1Button.on('pointerdown', () => loadLevel('level1', this));
    level2Button.on('pointerdown', () => loadLevel('level2', this));
    level3Button.on('pointerdown', () => loadLevel('level3', this));

    this.input.on('pointerdown', (pointer) => {
        const x = Math.floor((pointer.x - 75) / Tile.TILE_SIZE);
        const y = Math.floor((pointer.y - 75) / Tile.TILE_SIZE);

        if (x >= 0 && x <= 10 && y >= 0 && y <= 10) {
            tiles[y][x].select();
        }
    });
}

function loadLevel(levelKey, scene) {
    // Clear the current level
    // ...

    // Load the new level
    const levelDesign = levelDesigns[levelKey];
    for (let i = 0; i < 10; i++) {
        tiles[i] = [];
        for (let j = 0; j < 10; j++) {
            let type = levelDesign[i][j];
            let tile;
            switch (type) {
                case 'Connector':
                    tile = new Connector(scene, i, j);
                    break;
                case 'House':
                    tile = new House(scene, i, j);
                    break;
                case 'HouseBattery':
                    tile = new HouseBattery(scene, i, j);
                    tile.bg.setFillStyle(colorIdle, 1)
                    break;
                case 'HouseSolar':
                    tile = new HouseSolar(scene, i, j);
                    break;
                case 'HouseSolarBattery':
                    tile = new HouseSolarBattery(scene, i, j);
                    tile.bg.setFillStyle(colorIdle, 1)
                    break;
                case 'Coal':
                    tile = new Coal(scene, i, j);
                    break;
                case 'Gas':
                    tile = new Gas(scene, i, j);
                    break;
                case 'Nuclear':
                    tile = new Nuclear(scene, i, j);
                    break;
                case 'Biomass':
                    tile = new Biomass(scene, i, j);
                    break;
                case 'Geothermal':
                    tile = new Geothermal(scene, i, j);
                    break;
                case 'Hydro':
                    tile = new Hydro(scene, i, j);
                    break;
                case 'SolarPanel':
                    tile = new SolarPanel(scene, i, j);
                    break;
                case 'Tidal':
                    tile = new Tidal(scene, i, j);
                    break;
                case 'Windmill':
                    tile = new Windmill(scene, i, j);
                    break;
                case 'ChemicalBattery':
                    tile = new ChemicalBattery(scene, i, j);
                    tile.bg.setFillStyle(colorIdle, 1); // TODO change once ChemicalBattery has a image and not a color.
                    break;
                case 'GravityBattery':
                    tile = new GravityBattery(scene, i, j);
                    tile.setFillStyle(colorIdle, 1)
                    break;
                case 'Forest':
                    tile = new Forest(scene, i, j);
                    break;
                case 'Plains':
                    tile = new Plains(scene, i, j);
                    break;
                case 'Sea':
                    tile = new Sea(scene, i, j);
                    break;
                default:
                    tile = new Tile(scene, i, j, "red");
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
                drawWiring(scene, i, j, levelDesign);
            }
        }
    }

    // Initial selection
    tiles[0][0].select();

    currentLevel = levelKey;
}

function updateGridPower() {
    gridPower = 0;
    // Update the grid power
    gridPower += tiles
        .flat()
        .filter(tile => tile instanceof PowerProducer && typeof tile.powerOutput === 'number')
        .reduce((sum, tile) => sum + tile.powerOutput, 0);
    gridPower -= tiles
        .flat()
        .filter(tile => tile instanceof PowerConsumer && typeof tile.powerConsumption === 'number')
        .reduce((sum, tile) => sum + tile.powerConsumption, 0);
}

function updatePowerStorage() {
    // Update the batteries
    tiles
        .flat()
        .filter(tile => tile instanceof PowerStorage)
        .forEach(tile => {
            if (tile.status === 'charging' && gridPower > 0) {
                let chargePower = Math.min(gridPower, tile.storageCapacity - tile.currentPower);
                tile.charge(chargePower);
                gridPower -= chargePower; // Decrease gridPower by the amount of power charged
            } else if (tile.status === 'discharging' && tile.currentPower > 0) {
                let dischargePower = Math.min(tile.currentPower, gridPower);
                tile.discharge(dischargePower);
                gridPower += dischargePower; // Increase gridPower by the amount of power discharged
            } else if (tile.status === 'idle') {
                tile.idle();
                console.log('Idle', tile.currentPower, tile.storageCapacity)
            }
        });
}

function onTick() {
    // Logic that should happen every tick
    if (typeof gridPower !== 'number') {
        console.error('gridPower is not a number:', gridPower);
        return;
    }
    if (!paused) {
        hourCounter++;
        currentConsumption = getCurrentConsumption();

        currentProduction = getCurrentProduction();

        updateGridPower();
        updatePowerStorage();

        electricityText.setText('Electricity price: ' + currentElectricityPrice + ' € / kWh');
        gridPowerText.setText('Grid Power ' + gridPower + ' kW');

        transactionHistory.addTransaction(currentConsumption, 'expense', 'Hourly expense');
        updateMoneyDisplay();
        updateTimeDisplay();
        // Update the color of all PowerConsumers based on their status

        tiles.flat().filter(tile => tile instanceof PowerStorage).forEach(tile => {
            switch (tile.status) {
                case 'charging':
                    tile.bg.setFillStyle(colorCharge, 1);
                    break;
                case 'discharging':
                    tile.bg.setFillStyle(colorDischarge, 1);
                    break;
                case 'idle':
                    tile.bg.setFillStyle(colorIdle, 1);
                    break;
                default:
                    tile.bg.setFillStyle(0x000000, 1);
                    break;
            }
        });

        tiles.flat().filter(tile => tile instanceof PowerStorage).forEach(tile => {
            let chargePercentage = tile.currentPower / tile.storageCapacity;

            if (chargePercentage === 0) {
                tile.setImage(this, 'battery-empty');
            } else if (chargePercentage < 0.25) {
                tile.setImage(this, 'battery-one-bar');
            } else if (chargePercentage < 0.5) {
                tile.setImage(this, 'battery-two-bars');
            } else if (chargePercentage < 0.75) {
                tile.setImage(this, 'battery-three-bars');
            } else {
                tile.setImage(this, 'battery-full');
            }
        });

        // Set random weather
        if (hourCounter % 6 === 0) {
            if (!!weatherManager) {
                weatherManager.setRandomWeather();
            }
        }
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
