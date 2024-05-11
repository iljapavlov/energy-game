import { Tile } from "../Tile.js";

export class House extends Tile {
    static houseCount = 0;
    constructor(scene, i, j) {
        super(scene, i, j, 'house');
        House.houseCount ++;
    }
}