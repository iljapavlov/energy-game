import { PowerProducer } from "../PowerProducer.js";

export class Windmill extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'windMill');
    }
}