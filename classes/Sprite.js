import Instance from "./Instance.js"
import Vector2 from "./Vector2.js"
import GameService from "./GameService.js"

export default class Sprite extends Instance {
    #Game = new GameService;

    constructor(parent, imageSrc, xPos, yPos, xSize, ySize) {
        super(parent);

        this.Image = new Image;
        this.Image.src = imageSrc;
        this.Position = new Vector2(xPos, yPos);
        this.Size = new Vector2(xSize, ySize);

        /*
        this.#Game.Canvas.addEventListener("Heartbeat", (event) => {
            const dt = event.detail.delta

            const yMove = dt * 100;
            const xMove = dt * 100;

            if ((this.Position.y + yMove) < (this.#Game.Canvas.height - this.Size.y)
                && (this.Position.y + yMove) > 0) {
                    this.Position.y += yMove;
            } 

            if ((this.Position.x + xMove) < (this.#Game.Canvas.width - this.Size.x)
                && (this.Position.x + xMove) > 0) {
                    this.Position.x += xMove;
            } 
        });*/
    }
}