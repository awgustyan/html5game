import Instance from "./Instance.js"
import Sprite from "./Sprite.js"

export default class GameService {
    #lastDrawCurrentTime = 0;

    constructor() {
        if (GameService._instance) {
           return GameService._instance
        }

        GameService._instance = this;

        this.Canvas = document.getElementById("canvas");
        this.Ctx = this.Canvas.getContext("2d");

        this.Workspace = new Instance(this);
    }

    draw = () => {
        const dt = (document.timeline.currentTime - this.#lastDrawCurrentTime) / 1000

        this.Ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        // Draw

        this.Workspace.Children.forEach(element => {
            if (element.constructor.name == "Sprite") {
                this.Ctx.drawImage(element.Image, element.Position.x, element.Position.y, element.Size.x, element.Size.y)
            }
        });

        // 

        this.Canvas.dispatchEvent(new CustomEvent("Heartbeat", {
            detail: { delta: dt }
        }));

        this.#lastDrawCurrentTime = document.timeline.currentTime;
        window.requestAnimationFrame(this.draw);
    }

    init = () => {
        this.Ctx.globalCompositeOperation = "destination-over";

        var level = [
            new Sprite(this.Workspace, "/assets/moon.png", 50, 100, 50, 50),
        ]

        level.forEach(element => {
            this.Workspace.addChild(element);
        });

        console.log("initted");

        this.draw();
    }
}