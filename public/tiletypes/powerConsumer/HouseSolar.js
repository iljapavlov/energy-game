import { PowerConsumer } from "./PowerConsumer.js";

export class HouseSolar extends PowerConsumer {
    constructor(scene, i, j) {
        super(scene, i, j, 'green', 30); // 30 is an example power consumption
    }
}