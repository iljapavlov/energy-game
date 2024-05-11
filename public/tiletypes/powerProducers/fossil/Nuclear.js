import { PowerProducer } from "../PowerProducer.js";

export class Nuclear extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'yellow', 300, false); // 300 is an example power output
    }
}