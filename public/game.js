/**
 * @file game.js
 * This file contains the main game logic for a tile-based game.
 * It uses the Phaser game framework and includes the creation of the game scene, game objects, and game logic.
 */

// Import necessary modules and classes
import { EleringDataFetcher } from './EleringDataFetcher.js';
import { Tile } from './Tile.js';
import { InfoPanel } from './info/InfoPanel.js';
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
import { Grass } from './tiletypes/terrain/Grass.js';
import { GrassFlowers } from './tiletypes/terrain/GrassFlowers.js';
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
var gameScore = 0;

var currentLevel = 'level1';
var dayNightOverlay;

/**
 * The Phaser game instance.
 */
var game = new Phaser.Game(config);

// Other game variables
var cursors; // To hold the cursor keys
var tiles = []; // 2D array of tiles
var gameTimer;
var paused = true;
// let transactionHistory;
let eleringDataFetcher;

let HOURLY_CONSUMPTION = [];
let HOURLY_PRODUCTION = [];

var hourCounter = 36;
let weatherManager = null;
let infoPanel = null;

// var moneyText; // To update the money display dynamically
var timeText; // To update the time display dynamically
var dayText; 
var electricityText;
var gridPowerText;
var gridPower = 0;
let colorCharge = 0xDF9FF;
let colorDischarge = 0xFF9F9F;
let colorIdle = 0x9F9FFF;

// score calculation
let energyPriceHistory = [];
var scoreText;

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
    const BASE_ELECTRICITY_PRICE = 0.1; // Base price per MWh in dollars

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
    // Load object image
    this.load.image('house', './img/house.png');
    this.load.image('house-night', './img/house-night.png');
    this.load.image('house-solar', './img/house-solar.png');
    // this.load.image('house-battery', './img/house-battery.png');
    this.load.image('solar-panel', './img/solar-panel.png');
    this.load.image('tower', './img/tower.png');
    this.load.image('water', './img/water.png');
    this.load.image('grass', './img/grass.png');
    this.load.image('grass-flowers', './img/grass-flowers.png');
    this.load.image('power-plant-on', './img/power-plant-on.png');
    this.load.image('forest', './img/forest.png');

    // Weather images
    this.load.image('sun', './img/weather/sun.png');
    this.load.image('moon', './img/weather/moon.png');
    this.load.image('cloudySun', './img/weather/cloudySun.png');
    this.load.image('storm', './img/weather/storm.png');


    // Homes with batteries images
    this.load.image('house-solar-battery-empty', './img/house-solar-batteries/HOUSE_AND_BATTERY_0_.png')
    this.load.image('house-solar-battery-one-bar', './img/house-solar-batteries/HOUSE_AND_BATTERY_25_.png')
    this.load.image('house-solar-battery-two-bars', './img/house-solar-batteries/HOUSE_AND_BATTERY_50_.png')
    this.load.image('house-solar-battery-three-bars', './img/house-solar-batteries/HOUSE_AND_BATTERY_75_.png')
    this.load.image('house-solar-battery-full', './img/house-solar-batteries/HOUSE_AND_BATTERY_100_.png')

    // Chemical Battery Images
    this.load.image('battery-white', './img/battery-statuses/battery_white.png');

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
    this.add.rectangle(0, 0, 900, 40, 0x333333).setOrigin(0);
    this.add.text(10, 5, 'GriVi', {fontSize: '32px', fill: '#fff', fontFamily: 'Arial'});
    this.add.text(170, 10, 'Connect with Energy, Learn the Grid!', {fontSize: '22px', fill: '#fff', fontFamily: 'Arial'});
    scoreText = this.add.text(780, 9, 'Score:  0' , {fontFamily: 'Arial', fontSize: '18px', fill: '#fff'});

    // Create tiles
    loadLevel('level1', this, false)

    // create overlay for illumination
    const mapWidthInTiles = 10; // Example: 10 tiles wide
    const mapHeightInTiles = 10; // Example: 10 tiles high
    const tileSize = Tile.TILE_SIZE*0.95; // Each tile is 50 pixels square

    const overlayWidth = mapWidthInTiles * tileSize;
    const overlayHeight = mapHeightInTiles * tileSize;

    const xOffset = 25;
    const yOffset = 75;

    // Create overlay for illumination
    dayNightOverlay = this.add.rectangle(xOffset+0, yOffset+0, xOffset+overlayWidth, yOffset+overlayHeight, 0x000000, 1).setOrigin(0, 0);
    dayNightOverlay.setDepth(100); // Ensure it's on top of other game elements
    dayNightOverlay.setAlpha(0); // Start with some initial transparency

    // Capture keyboard arrows
    cursors = this.input.keyboard.createCursorKeys();

    // // money related things
    // moneyText = this.add.text(10, 20, 'Money: €' + money, {fontSize: '20px', fill: '#fff'});
    // // Initialize the transaction history
    // transactionHistory = new TransactionHistory();
    // transactionHistory.addTransaction(money, 'income', 'Initial money')

    // Create a looped timer event that triggers every second
    gameTimer = this.time.addEvent({delay: 1500, callback: onTick, callbackScope: this, loop: true});
    // Add keyboard inputs for pausing and resuming the game
    this.input.keyboard.on('keydown-P', pauseGame, this);
    this.input.keyboard.on('keydown-R', resumeGame, this);
    timeText = this.add.text(680, 110, 'Hour: ' + hourCounter%24+':00', {fontFamily: 'Arial', fontSize: '18px', fill: '#fff'});
    dayText = this.add.text(680, 90, 'Day:  ' + Math.floor(hourCounter/24), {fontFamily: 'Arial', fontSize: '18px', fill: '#fff'});
    currentElectricityPrice = getCurrentElectricityPrice(currentProduction, currentConsumption);

    // consumptionText = this.add.text(500, 20, 'Consumption: ' + currentConsumption, { fontSize: '18px', fill: '#fff' });
    // productionText = this.add.text(700, 20, 'Production: ' + currentProduction, { fontSize: '18px', fill: '#fff' });
    electricityText = this.add.text(575, 180, 'Electricity price: ' + (isNaN(currentElectricityPrice) ? 10 : currentElectricityPrice) + '€ / MWh', {
        fontFamily: 'Arial', fontSize: '14px', fill: '#fff'
    });

    gridPowerText = this.add.text(575, 160, 'Grid Power ' + gridPower, {
        fontFamily: 'Arial', fontSize: '14px', fill: '#fff'
    });

    // Step 1: Create a new container
    let buttonContainer = this.add.container(this.game.config.width - 100, this.game.config.height - 100);

    // Step 2: Create a few buttons
    let setToCharge = this.add.rectangle(0, 0, 110, 30, colorCharge).setInteractive();
    let setToDischarge = this.add.rectangle(0, -40, 110, 30, colorDischarge).setInteractive();
    let setToIdle = this.add.rectangle(0, -80, 110, 30, colorIdle).setInteractive();

    // Add text to the buttons
    let textCharge = this.add.text(0, 0, 'Charge', {fontFamily: 'Arial', color: '#000000', fontSize: '14px'}).setOrigin(0.5);
    let textDischarge = this.add.text(0, -40, 'Discharge', {fontFamily: 'Arial', color: '#000000', fontSize: '14px'}).setOrigin(0.5);
    let textIdle = this.add.text(0, -80, 'Inactivate', {fontFamily: 'Arial', color: '#000000', fontSize: '14px'}).setOrigin(0.5);

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
    this.add.text(580, 550, 'Level:', { fontFamily: 'Arial', fontSize: '32px', fill: '#fff' });

    // Add the buttons
    this.add.image(
        680,460,
        'battery-white'
    ).setScale(0.4).setDepth(0)

    const level1Button = this.add.text(710, 550, '1', { fontFamily: 'Arial', fontSize: '32px', fill: '#fff' }).setInteractive();
    const level2Button = this.add.text(760, 550, '2', { fontFamily: 'Arial', fontSize: '32px', fill: '#fff' }).setInteractive();
    const level3Button = this.add.text(810, 550, '3', { fontFamily: 'Arial', fontSize: '32px', fill: '#fff' }).setInteractive();

    // Add click events to the buttons
    level1Button.on('pointerdown', () => loadLevel('level1', this, true));
    level2Button.on('pointerdown', () => loadLevel('level2', this, true));
    level3Button.on('pointerdown', () => loadLevel('level3', this, true));

    this.input.on('pointerdown', (pointer) => {
        const x = Math.floor((pointer.x - 25) / Tile.TILE_SIZE);
        const y = Math.floor((pointer.y - 75) / Tile.TILE_SIZE);

        if (x >= 0 && x <= 10 && y >= 0 && y <= 10) {
            tiles[y][x].select();
    
            infoPanel.setSelectedTileText(tiles[y][x]);
        }

    });

    infoPanel = new InfoPanel(this, tiles[0][0]);
    infoPanel.setSelectedTileText(tiles[0][0]);
}

function loadLevel(levelKey, scene, isNotInit) {
    // Clear the current level
    // ...
    gridPower=0;
    currentElectricityPrice=0;
    hourCounter=36;

    tiles = [];
    money=10000;

    if (isNotInit) {
        scene.update()
        // transactionHistory.resetTransactionHistory();
    }

    // Load the new level
    const levelDesign = levelDesigns[levelKey];
    for (let i = 0; i < 10; i++) {
        tiles[i] = [];
        for (let j = 0; j < 10; j++) {
            let type = levelDesign[i][j];
            let tile;
            switch (type.split(";")[0]) {
                case 'Connector':
                    tile = new Connector(scene, i, j);
                    break;
                case 'House':
                    tile = new House(scene, i, j, type.split(";")[1]);
                    break;
                case 'HouseBattery':
                    tile = new HouseBattery(scene, i, j);
                    tile.bg.setFillStyle(colorIdle, 1)
                    break;
                case 'HouseSolar':
                    tile = new HouseSolar(scene, i, j);
                    break;
                case 'HouseSolarBattery':
                    tile = new HouseSolarBattery(scene, i, j, type.split(";")[1]);
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
                case 'Grass':
                    tile = new Grass(scene, i, j);
                    break;
                case 'GrassFlowers':
                    tile = new GrassFlowers(scene, i, j);
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

        const baseX = 25; // Base X-coordinate for the tiles
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

                if ((!['Sea', 'Plains', 'Forest', 'Grass', 'GrassFlowers'].includes(tileName)) && (!['Sea', 'Plains', 'Forest', 'Grass', 'GrassFlowers'].includes(neighbour))){
                    const neighborCenterX = baseX + nj * tileSize + tileSize / 2;
                    const neighborCenterY = baseY + ni * tileSize + tileSize / 2;

                    // Calculate angle and distance for the wire
                    const angle = Math.atan2(neighborCenterY - centerY, neighborCenterX - centerX);
                    const distance = Phaser.Math.Distance.Between(centerX, centerY, neighborCenterX, neighborCenterY);

                    // Create a rectangle (wire) rotated to connect centers
                    const wire = scene.add.rectangle(centerX, centerY, distance, wireWidth, 0x314a26)
                        .setOrigin(0, 0.5)
                        .setAngle(Phaser.Math.RadToDeg(angle))
                        .setDepth(1);
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
        if (hourCounter >= 24*10) {
            pauseGame();
        }
        currentConsumption = getCurrentConsumption();

        currentProduction = getCurrentProduction();

        updateGridPower();
        updatePowerStorage();

        currentElectricityPrice = getCurrentElectricityPrice(currentProduction, currentConsumption);

        energyPriceHistory.push(currentElectricityPrice);
        electricityText.setText('Electricity price: ' + currentElectricityPrice + ' € / MWh');
        gridPowerText.setText('Grid Power ' + gridPower + ' kW');

        // transactionHistory.addTransaction(currentConsumption, 'expense', 'Hourly expense');
        // updateMoneyDisplay();
        updateTimeDisplay();
        updateScoreDisplay();

        updateIllumination(hourCounter%24);
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

        tiles.flat().filter(tile => tile instanceof ChemicalBattery).forEach(tile => {
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

        tiles.flat().filter(tile => tile instanceof HouseSolarBattery).forEach(tile => {
            let chargePercentage = tile.currentPower / tile.storageCapacity;
            if (chargePercentage === 0) {
                tile.setImage(this, 'house-solar-battery-empty');
            } else if (chargePercentage < 0.25) {
                tile.setImage(this, 'house-solar-battery-one-bar');
            } else if (chargePercentage < 0.5) {
                tile.setImage(this, 'house-solar-battery-two-bars');
            } else if (chargePercentage < 0.75) {
                tile.setImage(this, 'house-solar-battery-three-bars');
            } else {
                tile.setImage(this, 'house-solar-battery-full');
            }
        });

        // Set random weather
        if (hourCounter%24 > 8 && hourCounter%24 < 21) {
            weatherManager.setWeather('sun')
        } else {
            weatherManager.setWeather('moon')
        }
        // if (hourCounter % 6 === 0) {
        //     if (!!weatherManager) {
        //         weatherManager.setRandomWeather();
        //     }
        // }
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
 * The updateTimeDisplay function is used to update the display of the current day.
 */
function updateTimeDisplay() {
    timeText.setText('Hour: ' + hourCounter%24+':00');
    dayText.setText('Day:  '+ Math.floor(hourCounter/24));
}

/**
 * Game score = average electricity price. (Game stops automatically after 10 days)
 */
function add(accumulator, a) {
    return accumulator + --a;
  }

function updateScoreDisplay() {
    console.log('updating score')
    console.log(energyPriceHistory)
    const avgPrice = energyPriceHistory.reduce(add, 0)/energyPriceHistory.length;
    scoreText.setText('Score: ' + avgPrice.toFixed(3));
}

// Simulate day and night cycle by varying the alpha of the overlay
// Assuming the day is from hour 6 to 18, adjust alpha accordingly
function updateIllumination(hour) {
    let alpha;
    const maxLight = 1;
    const minLight = 0.7;

    if (hour >= 12 && hour <= 16) {
        // Maximum light with slight random variation
        alpha = maxLight + (Math.random() * 0.5 - 0.025); // +/- 0.05 variation
    } else if (hour > 16 && hour <= 21) {
        // Logarithmic decrease to minLight
        // Calculate a scaling factor based on the time difference
        const scale = (hour - 16) / (21 - 16);
        alpha = maxLight - ((Math.log10(scale * 9 + 1) / Math.log10(10)) * (maxLight - minLight));
    } else if (hour > 21 || hour < 4) {
        // Constant darkness
        alpha = minLight;
    } else if (hour >= 4 && hour < 12) {
        // Exponential rise to maxLight
        // Normalize time from 0 at 4 AM to 1 at 12 PM
        const normalizedTime = (hour - 4) / (12 - 4);
        alpha = minLight + (Math.exp(normalizedTime * Math.log(2)) - 1) / (Math.exp(Math.log(2)) - 1) * (maxLight - minLight);
    }

    // Ensure alpha is clamped to the range [minLight, maxLight]
    alpha = 1 - Math.max(minLight, Math.min(maxLight, alpha));

    // Set the alpha of the dayNightOverlay based on the calculated light intensity
    dayNightOverlay.setAlpha(alpha);
    console.log('Illumination: ',alpha)
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
