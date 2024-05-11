import { PowerStorage } from "./PowerStorage.js";

export class GravityBattery extends PowerStorage {
    constructor(scene, i, j) {
        super(scene, i, j, 'gravityBattery');
        this.status = 'idle'; // can be 'charging', 'discharging', or 'idle'
        this.capacity = 100; // maximum amount of power the battery can store
        this.currentPower = 0; // current amount of power in the battery
    }
}