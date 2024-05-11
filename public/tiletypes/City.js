import {Tile} from "../Tile.js";

export class City extends Tile {
    constructor(scene, i, j, tileSize) {
        super(scene, i, j, 'grey', tileSize);
    }

}