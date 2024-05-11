import {Tile} from "../../Tile.js";

export class PowerStorage extends Tile {
    constructor(scene, i, j, tileSize, storageCapacity) {
        super(scene, i, j, 'yellow');
        this.storageCapacity = storageCapacity;
    }

    getStorageCapacity() {
        return this.storageCapacity;
    }

    setStorageCapacity(storageCapacity) {
        this.storageCapacity = storageCapacity;
    }
}