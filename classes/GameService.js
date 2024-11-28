import Instance from "./Instance.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";

export default class GameService extends Instance {
    #lastDrawCurrentTime = 0;

    constructor() {
        super()

        if (GameService._instance) {
           return GameService._instance
        }

        GameService._instance = this;

        this.Gravity = 1100;

        this.Canvas = document.getElementById("canvas");
        this.Ctx = this.Canvas.getContext("2d");

        this.Level = {
            ["Objects"] : [
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 0, 720 - 64, 64, 64),
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 1, 720 - 64, 64, 64),
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 2, 720 - 64, 64, 64),
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 3, 720 - 64, 64, 64),
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 4, 720 - 64, 64, 64),
    
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 11, 720 - 64 * 4, 64, 64),
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 12, 720 - 64 * 4, 64, 64),
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 9, 720 - 64 * 4, 64, 64),
                new Sprite(this.Workspace, "/assets/bricks.png", 64 * 10, 720 - 64 * 4, 64, 64),
            ],
            ["SpawnPosition"] : new Vector2(64 * 1, 720 - 240)
        };

        this.Workspace = new Instance(this);
        this.Enviroment = [];
    }

    draw = () => {
        const dt = (document.timeline.currentTime - this.#lastDrawCurrentTime) / 1000

        this.Ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        // Draw

        this.Workspace.Children.forEach(element => {
            if (element.constructor.name == "Sprite" ||
                element.constructor.name == "VelocitySprite"
            ) {
                this.Ctx.drawImage(element.Image, element.Position.x, element.Position.y, element.Size.x, element.Size.y)
            }
        });

        // 

        document.dispatchEvent(new CustomEvent("Heartbeat", {
            detail: { delta: dt }
        }));

        this.#lastDrawCurrentTime = document.timeline.currentTime;
        window.requestAnimationFrame(this.draw);
    }

    init = () => {
        this.Ctx.globalCompositeOperation = "destination-over";

        this.Level.Objects.forEach(element => {
            this.Workspace.addChild(element);
            this.Enviroment.push(element);
        });

        console.log("initted");

        this.draw();
    }
}