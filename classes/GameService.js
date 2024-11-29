import Roomba from "./Enemies/Roomba.js";
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
        this.Workspace = new Instance(this);

        this.Level = {
            ["Objects"] : [
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 0, 720 - 64), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 1, 720 - 64), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 2, 720 - 64), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 3, 720 - 64), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 4, 720 - 64), new Vector2(64, 64), true),
    
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 9, 720 - 64 * 4), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 10, 720 - 64 * 4), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 11, 720 - 64 * 4), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 12, 720 - 64 * 4), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 13, 720 - 64 * 4), new Vector2(64, 64), true),

                new Roomba(this.Workspace, "/assets/enemy.png", 1, new Vector2(64 * 6, 720 - 80), new Vector2(64, 80), true),

                new Sprite(this.Workspace, "/assets/background.jpg", -10, new Vector2(-this.Canvas.width * 0.2, -this.Canvas.height * 0.4), new Vector2(this.Canvas.width * 1.4, this.Canvas.height * 1.4), false),
            ],
            ["SpawnPosition"] : new Vector2(64 * 1, 720 - 240)
        };
    }

    Draw = () => {
        const dt = (document.timeline.currentTime - this.#lastDrawCurrentTime) / 1000

        this.Ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        // Draw
        this.Ctx.reset
        //this.Ctx.translate(1, 0);

        var map = this.Workspace.Children.map(function (element, index) {
            return { index : index, value : element.zIndex || 0 };
        });
        
        map.sort(function (a, b) {
            return b.value - a.value;
        });
        
        this.Workspace.Children = map.map((element) => {
            return this.Workspace.Children[element.index];
        });

        for (let index = 0; index < this.Workspace.Children.length; index++) {
            const element = this.Workspace.Children[index];
            
            if (element.Destroying) {
                this.Workspace.Children.pop(index);
                continue
            }

            if (element.Image) {
                this.Ctx.drawImage(element.Image, element.Position.x, element.Position.y, element.Size.x, element.Size.y);
            }
        }

        document.dispatchEvent(new CustomEvent("Heartbeat", {
            detail: { delta: dt }
        }));

        this.#lastDrawCurrentTime = document.timeline.currentTime;
        window.requestAnimationFrame(this.Draw);
    }

    Init = () => {
        this.Ctx.globalCompositeOperation = "destination-over";
        console.log("initted");

        this.Draw();
    }
}