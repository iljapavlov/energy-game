import { PowerConsumer } from "./PowerConsumer.js";

export class HouseBattery extends PowerConsumer {
    constructor(scene, i, j) {
        super(scene, i, j, 'houseBattery');
    }
}