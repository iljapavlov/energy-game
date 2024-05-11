import {PowerConsumer} from "./PowerConsumer.js";

export class House extends PowerConsumer {
    static houseCount = 0;
    constructor(scene, i, j) {
        super(scene, i, j, 'house');
        House.houseCount ++;
    }
}