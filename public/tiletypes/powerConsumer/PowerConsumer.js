import {Tile} from "../../Tile.js";
import { TILE_CONFIG } from "../../TileConfig.js";

export class PowerConsumer extends Tile {
    constructor(scene, i, j, tileName) {
        super(scene, i, j, tileName);
        this.powerConsumption = TILE_CONFIG[tileName]['powerConsumption'];
    }

    getPowerConsumption() {
        return this.powerConsumption;
    }

    setPowerConsumption(powerConsumption) {
        this.powerConsumption = powerConsumption;
    }
}