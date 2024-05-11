import { PowerProducer } from "../PowerProducer.js";

export class Geothermal extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'orange', 140, true); // 140 is an example power output
    }
}