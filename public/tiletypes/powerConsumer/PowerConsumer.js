import {Tile} from "../../Tile.js";

export class PowerConsumer extends Tile {
    constructor(scene, i, j, tileSize, powerConsumption) {
        super(scene, i, j, 'yellow');
        this.powerConsumption = powerConsumption;
    }

    getPowerConsumption() {
        return this.powerConsumption;
    }

    setPowerConsumption(powerConsumption) {
        this.powerConsumption = powerConsumption;
    }
}