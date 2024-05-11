import { PowerProducer } from "../PowerProducer.js";

export class Geothermal extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'geothermal');
    }
}