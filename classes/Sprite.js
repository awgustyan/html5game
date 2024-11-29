import Instance from "./Instance.js";
import Vector2 from "./Vector2.js";
import GameService from "./GameService.js";

export default class Sprite extends Instance {
    constructor(parent, imageSrc, positionV2, sizeV2, CanCollide) {
        super(parent);

        this.Image = new Image;
        this.Image.src = imageSrc;
        this.Position = positionV2;
        this.Size = sizeV2;

        this.CanCollide = CanCollide;
    }
}