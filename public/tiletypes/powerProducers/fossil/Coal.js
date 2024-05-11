import { PowerProducer } from "../PowerProducer.js";

export class Coal extends PowerProducer {
    constructor(scene, i, j) {
        super(scene, i, j, 'grey', 200, false); // 200 is an example power output
    }
}