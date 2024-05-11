import { PowerProducer } from "../PowerProducer.js";

export class Nuclear extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'nuclear');
    }
}