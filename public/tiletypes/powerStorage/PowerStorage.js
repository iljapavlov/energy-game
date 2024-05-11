import {Tile} from "../../Tile.js";
import { TILE_CONFIG } from "../../TileConfig.js";

export class PowerStorage extends Tile {
    constructor(scene, i, j, tileName) {
        super(scene, i, j, tileName);
        this.storageCapacity = TILE_CONFIG[tileName]['storageCapacity'];
        this.status = 'idle'; // can be 'charging', 'discharging', or 'idle'
        this.currentPower = 100; // current amount of power in the battery

    }

    charge(power) {
        console.log('Charging: Power:', power, 'Current Power:', this.currentPower, 'Storage Capacity:', this.storageCapacity);
        this.status = 'charging';
        this.currentPower = Math.min(this.currentPower + power, this.storageCapacity);
    }

    discharge(power) {
        console.log('Discharging: Power:', power, 'Current Power:', this.currentPower);
        this.status = 'discharging';
        this.currentPower = Math.max(this.currentPower - power, 0);
    }

    idle() {
        this.status = 'idle';
    }
}