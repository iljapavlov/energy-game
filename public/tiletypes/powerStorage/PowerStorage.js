import {Tile} from "../../Tile.js";
import { TILE_CONFIG } from "../../TileConfig.js";

export class PowerStorage extends Tile {
    constructor(scene, i, j, tileName) {
        super(scene, i, j, tileName);
        this.storageCapacity = TILE_CONFIG[tileName]['storageCapacity'];
    }

    getStorageCapacity() {
        return this.storageCapacity;
    }

    setStorageCapacity(storageCapacity) {
        this.storageCapacity = storageCapacity;
    }
}