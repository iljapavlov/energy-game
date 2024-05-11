import { Tile } from "../../Tile.js";

export class PowerConsumer extends Tile {
    static houseCount = 0;

    constructor(scene, i, j, tileSize, powerConsumption) {
        super(scene, i, j, 'yellow');
        this.powerConsumption = powerConsumption;
        
        PowerConsumer.houseCount++;
    }

    getPowerConsumption() {
        return this.powerConsumption;
    }

    setPowerConsumption(powerConsumption) {
        this.powerConsumption = powerConsumption;
    }
}