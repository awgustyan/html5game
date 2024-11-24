import Instance from "./Instance.js";
import Vector2 from "./Vector2.js";
import GameService from "./GameService.js";

export default class Sprite extends Instance {
    constructor(parent, imageSrc, xPos, yPos, xSize, ySize) {
        super(parent);

        this.Image = new Image;
        this.Image.src = imageSrc;
        this.Position = new Vector2(xPos, yPos);
        this.Size = new Vector2(xSize, ySize);
    }
}