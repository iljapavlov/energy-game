import { PowerProducer } from "../PowerProducer.js";

export class Hydro extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'hydro');
    }
}