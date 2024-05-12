import { PowerProducer } from "../PowerProducer.js";

export class SolarPanel extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'solarPanel');
        this.powerOutput = 10;

    }
}