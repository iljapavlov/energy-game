import { PowerProducer } from "../PowerProducer.js";

export class Coal extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'coal');
    }
}