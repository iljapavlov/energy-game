import { PowerProducer } from "../PowerProducer.js";

export class SolarPanel extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'aqua');
    }
}