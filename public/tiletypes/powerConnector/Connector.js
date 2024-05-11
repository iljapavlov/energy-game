import {Tile} from "../../Tile.js";

export class Connector extends Tile {
    constructor(scene, i, j, tiles) {
        super(scene, i, j, 'connector');
        this.tiles = tiles;
        this.enabled = true;
        // this.updateAppearance();
    }

    // Commented out due to NPEs, method should be moved and refactored in game.js if it is needed for Appearance switching.
    // updateAppearance() {
    //     // Check the neighboring tiles
    //     let topNeighbor = this.i > 0 && this.tiles[this.i - 1] && this.tiles[this.i - 1][this.j] instanceof Connector ? '1' : '0';
    //     let rightNeighbor = this.j < this.tiles[0].length - 1 && this.tiles[this.i] && this.tiles[this.i][this.j + 1] instanceof Connector ? '1' : '0';
    //     let bottomNeighbor = this.i < this.tiles.length - 1 && this.tiles[this.i + 1] && this.tiles[this.i + 1][this.j] instanceof Connector ? '1' : '0';
    //     let leftNeighbor = this.j > 0 && this.tiles[this.i] && this.tiles[this.i][this.j - 1] instanceof Connector ? '1' : '0';
    //
    //     // Create a binary string representing the presence of neighbors
    //     let neighbors = topNeighbor + rightNeighbor + bottomNeighbor + leftNeighbor;
    //
    //     // Use a switch statement to handle each combination
    //     switch (neighbors) {
    //         case '0000':
    //             // No neighbors
    //             break;
    //         case '0001':
    //             // Left neighbor only
    //             break;
    //         case '0010':
    //             // Bottom neighbor only
    //             break;
    //         case '0011':
    //             // Bottom and left neighbors
    //             break;
    //         case '0100':
    //             // Right neighbor only
    //             break;
    //         case '0101':
    //             // Right and left neighbors
    //             break;
    //         case '0110':
    //             // Right and bottom neighbors
    //             break;
    //         case '0111':
    //             // Right, bottom, and left neighbors
    //             break;
    //         case '1000':
    //             // Top neighbor only
    //             break;
    //         case '1001':
    //             // Top and left neighbors
    //             break;
    //         case '1010':
    //             // Top and bottom neighbors
    //             break;
    //         case '1011':
    //             // Top, bottom, and left neighbors
    //             break;
    //         case '1100':
    //             // Top and right neighbors
    //             break;
    //         case '1101':
    //             // Top, right, and left neighbors
    //             break;
    //         case '1110':
    //             // Top, right, and bottom neighbors
    //             break;
    //         case '1111':
    //             // All neighbors
    //             break;
    //     }
    // }
}