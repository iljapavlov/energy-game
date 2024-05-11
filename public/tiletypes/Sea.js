import {Tile} from "../Tile.js";

export class Sea extends Tile {
    constructor(scene, i, j, tileSize) {
        super(scene, i, j, 'blue', tileSize);
    }


}