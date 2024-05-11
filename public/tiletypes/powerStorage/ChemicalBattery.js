import { PowerStorage } from "./PowerStorage.js";

export class ChemicalBattery extends PowerStorage {
    constructor(scene, i, j) {
        super(scene, i, j, 'chemicalBattery');
        this.status = 'idle'; // can be 'charging', 'discharging', or 'idle'
    }
}