import {Tile} from "../../Tile.js";
import { TILE_CONFIG } from "../../TileConfig.js";

export class PowerProducer extends Tile {
    constructor(scene, i, j, tileName) {
        super(scene, i, j, tileName);
        // this.powerOutput = TILE_CONFIG[tileName]['powerOutput'];
        // this.isRenewable = TILE_CONFIG[tileName]['isRenewable'];
        this.powerOutput = 10;
        this.isRenewable = TILE_CONFIG[tileName]['isRenewable'];
    }

    getPowerOutput() {
        return this.powerOutput;
    }

    setPowerOutput(powerOutput) {
        this.powerOutput = powerOutput;
    }

    getIsRenewable() {
        return this.isRenewable;
    }

    setIsRenewable(isRenewable) {
        this.isRenewable = isRenewable;
    }
}