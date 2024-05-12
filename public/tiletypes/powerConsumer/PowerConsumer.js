import { Tile } from "../../Tile.js";
import { TILE_CONFIG } from "../../TileConfig.js";

export class PowerConsumer extends Tile {
    static houseCount = 0;

    constructor(scene, i, j, tileName, text) {
        super(scene, i, j, tileName, text);
        this.powerConsumption = TILE_CONFIG[tileName]['powerConsumption'];
        
        PowerConsumer.houseCount++;
    }

    getPowerConsumption() {
        return this.powerConsumption;
    }

    setPowerConsumption(powerConsumption) {
        this.powerConsumption = powerConsumption;
    }
}