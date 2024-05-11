export class Tile {
    static selectedTile = null;
    constructor(scene, i, j, color, tileSize) {
        this.i = i;
        this.j = j;
        this.color = color;
        this.tileSize = tileSize;
        this.hexColor = this.mapColorToHex(color);
        this.tile = scene.add.rectangle(100 + j * tileSize, 100 + i * tileSize, tileSize, tileSize, this.hexColor).setInteractive();
        this.tile.on('pointerdown', () => this.select());
    }

    select() {
        if (Tile.selectedTile) {
            // Remove border from previously selected tile
            Tile.selectedTile.tile.setStrokeStyle(0);
        }
        this.tile.setStrokeStyle(2, 0x00FF00); // Green border for selected tile
        Tile.selectedTile = this;
    }

    mapColorToHex(color) {
        switch (color) {
            case 'green': return 0x008000;
            case 'grey': return 0x808080;
            case 'blue': return 0x0000FF;
            default: return 0xFFFFFF;
        }
    }
}

