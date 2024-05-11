import { PowerStorage } from "./PowerStorage.js";

export class GravityBattery extends PowerStorage {
    constructor(scene, i, j) {
        super(scene, i, j, 'green', 200); // 200 is an example storage capacity
    }
}