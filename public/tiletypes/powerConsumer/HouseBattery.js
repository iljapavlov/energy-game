import { PowerConsumer } from "./PowerConsumer.js";

export class HouseBattery extends PowerConsumer {
    constructor(scene, i, j) {
        super(scene, i, j, 'blue', 40); // 40 is an example power consumption
    }
}