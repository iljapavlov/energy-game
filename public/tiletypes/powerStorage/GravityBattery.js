import { PowerStorage } from "./PowerStorage.js";

export class GravityBattery extends PowerStorage {
    constructor(scene, i, j) {
        super(scene, i, j, 'gravityBattery');
    }
}