import { Tile } from "../Tile.js";

export class Sea extends Tile {
    constructor(scene, i, j) {
        super(scene, i, j, 'sea');
    }
}