import { Tile } from "../../Tile.js";

export class Mountain extends Tile {
    constructor(scene, i, j) {
        super(scene, i, j, 'grey');
    }
}