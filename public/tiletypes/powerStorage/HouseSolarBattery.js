import {PowerStorage} from "./PowerStorage.js";

export class HouseSolarBattery extends PowerStorage {
    constructor(scene, i, j, text) {
        super(scene, i, j, 'houseSolarBattery', text);
        this.status = 'idle'; // can be 'charging', 'discharging', or 'idle'

    }
}