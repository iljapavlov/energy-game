import {Tile} from "../Tile.js";

export class Plains extends Tile {
    constructor(scene, i, j, tileSize) {
        super(scene, i, j, 'green', tileSize);
    }


}

