import { Tile } from "../Tile.js";

export class InfoPanel {
  constructor(scene, tileData) {
    this.scene = scene;

    this.pos = {
      x: 575,
      y: 190 + 50
    };

    this.titles = scene.add.text(this.pos.x, this.pos.y, "Info Panel", { fontFamily: 'Arial', fontSize: 26, color: '#ffffff' });
    this.text = scene.add.text(this.pos.x, this.pos.y + 40, "", { fontFamily: 'Arial', fontSize: 18, color: '#ffffff' });
    
    this.tile = new Tile(this.scene, 2, 11, tileData.name, tileData.text);
  }

  setSelectedTileText(tileData) {
    this.tile.setImage(this.scene, tileData.image, tileData.name);

    let finalText = '';
    let titleText = '';

    // Transform the name into title case
    console.log(tileData);
    let name = tileData.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    titleText += `${name}\n`;

    if (!!tileData.text) {
      finalText += tileData.text;
    }

    if (tileData.consumption) {
      titleText += `Power consumption: ${tileData.consumption}\n`;
    }
    if (tileData.powerOutput) {
      titleText += `Power output: ${tileData.powerOutput}\n`;
    }

    this.text.setText(finalText);
    this.titles.setText(titleText);
  }
}