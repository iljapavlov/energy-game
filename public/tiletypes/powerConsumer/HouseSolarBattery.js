import { PowerConsumer } from "./PowerConsumer.js";

export class HouseSolarBattery extends PowerConsumer {
    constructor(scene, i, j) {
        super(scene, i, j, 'yellow', 20); // 20 is an example power consumption
    }
}