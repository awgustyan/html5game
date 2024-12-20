import Roomba from "./Enemies/Roomba.js";
import Instance from "./Instance.js";
import Sprite from "./Sprite.js";
import Vector2 from "./Vector2.js";
import Player from "./Player.js";

export default class GameService extends Instance {
    #lastDrawCurrentTime = 0;
    #cameraBoxProggress = 0;

    constructor() {
        super()

        if (GameService._instance) {
           return GameService._instance
        }

        GameService._instance = this;

        this.Canvas = document.getElementById("canvas");
        this.Ctx = this.Canvas.getContext("2d");

        this.CanvasShadow = document.getElementById("canvasShadow");
        this.CtxShadow = this.Canvas.getContext("2d");

        this.Gravity = 1100;
        this.WorkspaceSize = new Vector2(3000, 720);
        this.CameraBoxSize = 100;

        this.Workspace = new Instance(this);
        this.Player = null;

        const SpawnPos = new Vector2(64 * 1, 720 - 240);

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

                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 17, 720 - 64 * 8), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 18, 720 - 64 * 8), new Vector2(64, 64), true),
                new Sprite(this.Workspace, "/assets/bricks.png", 1, new Vector2(64 * 19, 720 - 64 * 8), new Vector2(64, 64), true),

                new Player(this.Workspace, "/assets/player.png", 1, new Vector2(SpawnPos.x, SpawnPos.y), new Vector2(70, 140), true),
                new Roomba(this.Workspace, "/assets/enemy.png", 1, new Vector2(64 * 6, 720 - 80), new Vector2(64, 80), true),

                new Sprite(this.Workspace, "/assets/background.jpg", -10, new Vector2(500, 0), new Vector2(this.Canvas.width * 1.1, this.Canvas.height), false),
            ]
        };
    }

    Draw = () => {
        if (!this.Player) {
            this.Player = this.Workspace.FindFirstClass("Player");
        }

        if (this.Player.LastPosition) {
            this.#cameraBoxProggress = Math.min(Math.max(this.#cameraBoxProggress + (this.Player.LastPosition.x - this.Player.Position.x), -this.CameraBoxSize), this.CameraBoxSize)
        }

        document.getElementById("CamProg").innerHTML = "CamProg: " + this.#cameraBoxProggress;

        const dt = (document.timeline.currentTime - this.#lastDrawCurrentTime) / 1000
        const cameraOffset = this.Player.Position.x + this.#cameraBoxProggress

        this.Ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.CtxShadow.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        // Draw
        //this.Ctx.reset
        //this.Ctx.translate(-1, 0);

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
                this.Workspace.Children.splice(index, 1);
                index -= 1;
                continue;
            }

            if (element.Image) {
                this.Ctx.drawImage(element.Image, element.Position.x - cameraOffset + (this.Canvas.width * 0.5), element.Position.y, element.Size.x, element.Size.y);  
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