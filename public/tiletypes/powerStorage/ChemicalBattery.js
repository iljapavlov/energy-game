import { PowerStorage } from "./PowerStorage.js";

export class ChemicalBattery extends PowerStorage {
    constructor(scene, i, j) {
        super(scene, i, j, 'aqua', 100); // 100 is an example storage capacity
    }
}