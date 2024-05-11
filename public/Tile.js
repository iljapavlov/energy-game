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
     * @param {string} color - The color of the tile.
     */
    constructor(scene, i, j, color) {
        this.i = i;
        this.j = j;
        this.color = color;
        this.hexColor = this.mapColorToHex(color);
        this.tile = scene.add.rectangle(100 + j * Tile.TILE_SIZE, 100 + i * Tile.TILE_SIZE, Tile.TILE_SIZE, Tile.TILE_SIZE, this.hexColor).setInteractive();
        this.tile.on('pointerdown', () => this.select());
    }

    /**
     * Selects this tile.
     * If there is a previously selected tile, it removes the border from it.
     * Then, it adds a green border to this tile and sets it as the selected tile.
     */
    select() {
        if (Tile.selectedTile) {
            // Remove border from previously selected tile
            Tile.selectedTile.tile.setStrokeStyle(0);
        }
        this.tile.setStrokeStyle(2, 0x00FF00); // Green border for selected tile
        Tile.selectedTile = this;
    }

    /**
     * Maps a color name to a hex color code.
     * @param {string} color - The color name.
     * @returns {number} The hex color code.
     */
    mapColorToHex(color) {
        switch (color) {
            case 'green': return 0x008000;
            case 'grey': return 0x808080;
            case 'blue': return 0x0000FF;
            case 'aqua': return 0x00FFFF;
            default: return 0xFFFFFF;
        }
    }
}