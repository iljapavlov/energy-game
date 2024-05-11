import { PowerProducer } from "../PowerProducer.js";

export class Gas extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'blue', 150, false); // 150 is an example power output
    }
}