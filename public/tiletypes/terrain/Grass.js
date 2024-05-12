import { Tile } from "../../Tile.js";

export class Grass extends Tile {
    constructor(scene, i, j) {
        super(scene, i, j, 'grass');
    }
}