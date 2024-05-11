import { PowerProducer } from "../PowerProducer.js";

export class Tidal extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'tidal');
    }
}