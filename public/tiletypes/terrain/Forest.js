import { Tile } from "../../Tile.js";

export class Forest extends Tile {
    constructor(scene, i, j) {
        super(scene, i, j, 'green');
    }
}