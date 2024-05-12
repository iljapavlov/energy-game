import {PowerStorage} from "./PowerStorage.js";

export class HouseSolarBattery extends PowerStorage {
    constructor(scene, i, j) {
        super(scene, i, j, 'houseSolarBattery');
        this.status = 'idle'; // can be 'charging', 'discharging', or 'idle'

    }
}