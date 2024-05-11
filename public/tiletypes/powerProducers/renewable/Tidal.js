import { PowerProducer } from "../PowerProducer.js";

export class Tidal extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'blue', 170, true); // 170 is an example power output
    }
}