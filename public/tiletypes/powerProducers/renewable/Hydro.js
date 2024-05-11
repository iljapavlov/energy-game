import { PowerProducer } from "../PowerProducer.js";

export class Hydro extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'aqua', 180, true); // 180 is an example power output
    }
}