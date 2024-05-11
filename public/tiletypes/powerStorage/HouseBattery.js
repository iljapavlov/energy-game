import {PowerStorage} from "./PowerStorage.js";

export class HouseBattery extends PowerStorage {
    constructor(scene, i, j) {
        super(scene, i, j, 'houseBattery');
        this.status = 'idle'; // can be 'charging', 'discharging', or 'idle'
    }
}