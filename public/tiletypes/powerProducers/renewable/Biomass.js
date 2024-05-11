import { PowerProducer } from "../PowerProducer.js";

export class Biomass extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'green', 160, true); // 160 is an example power output
    }
}