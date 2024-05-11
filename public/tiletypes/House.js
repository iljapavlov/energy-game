import { Tile } from "../Tile.js";

export class House extends Tile {
    constructor(scene, i, j) {
        super(scene, i, j, 'house');
    }
}