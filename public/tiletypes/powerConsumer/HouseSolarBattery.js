import { PowerConsumer } from "./PowerConsumer.js";

export class HouseSolarBattery extends PowerConsumer {
    constructor(scene, i, j) {
        super(scene, i, j, 'houseSolarBattery');
    }
}