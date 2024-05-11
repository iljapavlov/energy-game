import {PowerConsumer} from "./PowerConsumer.js";

export class House extends PowerConsumer {
    constructor(scene, i, j) {
        super(scene, i, j, 'house');
    }
}
