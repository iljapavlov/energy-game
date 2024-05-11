import { PowerConsumer } from "./PowerConsumer.js";

export class HouseSolar extends PowerConsumer {
    constructor(scene, i, j) {
        super(scene, i, j, 'houseSolar');
    }
}