import { PowerProducer } from "../PowerProducer.js";

export class Biomass extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'biomass');
    }
}