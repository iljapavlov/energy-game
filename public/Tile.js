import { TILE_CONFIG } from "../TileConfig.js";
/**
 * @file Tile.js
 * This file contains the Tile class which represents a tile in a tile-based game.
 * Each tile has a color, position, and size, and can be selected by the player.
 */

/**
 * Tile class represents a tile in a tile-based game.
 * Each tile has a color, position, and size, and can be selected by the player.
 */
export class Tile {
    /**
     * The currently selected tile.
     * There can only be one selected tile at a time.
     */
    static selectedTile = null;
    static TILE_SIZE = 50;

    /**
     * Constructor for the Tile class.
     * Initializes a new tile with the given parameters and adds it to the game scene.
     * @param {Phaser.Scene} scene - The current game scene.
     * @param {number} i - The row index of the tile.
     * @param {number} j - The column index of the tile.
     * @param {string} tileName - Tile name
     */
    constructor(scene, i, j, tileName) {
        this.i = i;
        this.j = j;
        this.name = tileName;

        const bgColor = TILE_CONFIG[tileName].bgColor;
        const image = TILE_CONFIG[tileName].image;
        const animation = TILE_CONFIG[tileName].animation;

        // LAYERS
        // BG LAYER
        this.bg = scene.add.rectangle(
            100 + j * Tile.TILE_SIZE,
            100 + i * Tile.TILE_SIZE,
            Tile.TILE_SIZE,
            Tile.TILE_SIZE,
            bgColor
        ).setInteractive().setStrokeStyle(0);

        // IMAGE LAYER
        if (image) {
            this.tile = scene.add.image(
                100 + j * Tile.TILE_SIZE,
                100 + i * Tile.TILE_SIZE,
                image
            ).setInteractive().setDepth(2);
            const rescale =  TILE_CONFIG[tileName].rescale || 0.2;
            this.tile.setScale(rescale).setDepth(1);
        } else if (animation) {
            // Use scene to access the animations manager
            scene.anims.create({
                key: animation,
                frames: scene.anims.generateFrameNumbers(animation, { start: 0, end: 5 }),
                frameRate: 5,
                repeat: -1
            });
            this.tile = scene.add.sprite(100 + j * Tile.TILE_SIZE, 100 + i * Tile.TILE_SIZE, animation).play(animation);
            const rescale =  TILE_CONFIG[tileName].rescale || 0.2;
            this.tile.setScale(rescale).setDepth(1);
        }
    }

    setImage(scene, imageKey) {
        if (this.tile) {
            this.tile.destroy(); // Destroy the current image
            // this.tile.add.image(null);
            // this.scene.update()
        }
        this.tile = scene.add.image(
            100 + this.j * Tile.TILE_SIZE,
            100 + this.i * Tile.TILE_SIZE,
            imageKey
        ).setInteractive();
        const rescale = TILE_CONFIG[this.name] ? TILE_CONFIG[this.name].rescale || 0.2 : 0.2;
        this.tile.setScale(rescale).setDepth(1);
    }

    /**
     * Selects this tile.
     * If there is a previously selected tile, it removes the bg from it.
     * Then, it adds a green bg to this tile and sets it as the selected tile.
     */
    select() {
        if (Tile.selectedTile) {
            // Remove bg from previously selected tile
            Tile.selectedTile.bg.setStrokeStyle(0);
        }
        // Set green bg on the rectangle
        this.bg.setStrokeStyle(2, 0x00FF00); // Green bg for selected tile
        Tile.selectedTile = this;
    }
}