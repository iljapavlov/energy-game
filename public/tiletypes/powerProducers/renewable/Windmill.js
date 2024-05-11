import { PowerProducer } from "../PowerProducer.js";

export class Windmill extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'green', 120, true); // 120 is an example power output
    }
}