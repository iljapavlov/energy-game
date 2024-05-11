import {Tile} from "../../Tile.js";

export class PowerProducer extends Tile {
    constructor(scene, i, j, tileSize, powerOutput, isRenewable) {
        super(scene, i, j, 'yellow');
        this.powerOutput = powerOutput;
        this.isRenewable = isRenewable;
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