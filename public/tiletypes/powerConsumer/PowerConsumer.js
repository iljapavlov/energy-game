import {Tile} from "../../Tile.js";
import {House} from "./House.js";
import {HouseBattery} from "./HouseBattery.js";
import {HouseSolar} from "./HouseSolar.js";
import {HouseSolarBattery} from "./HouseSolarBattery.js";

export class PowerConsumer extends Tile {
    static houseCount = 0;

    constructor(scene, i, j, tileSize, powerConsumption) {
        super(scene, i, j, 'yellow');
        this.powerConsumption = powerConsumption;

        if (this instanceof House || this instanceof HouseBattery
            || this instanceof HouseSolar || this instanceof HouseSolarBattery) {
            PowerConsumer.houseCount++;
        }
    }

    getPowerConsumption() {
        return this.powerConsumption;
    }

    setPowerConsumption(powerConsumption) {
        this.powerConsumption = powerConsumption;
    }
}