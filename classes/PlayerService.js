import Instance from "./Instance.js";
import Sprite from "./Sprite.js";
import GameService from "./GameService.js";
import kibbo from "./Kibo.js";

export default class PlayerService {
    #Game = new GameService;

    #fallingTime = 0;
    #falling = false;

    constructor() {
        if (PlayerService._instance) {
           return PlayerService._instance
        }

        PlayerService._instance = this;

        this.PlayerSprite = new Sprite(this.#Game.Workspace, "/assets/player.png", 50, 100, 70, 140);
    }

    init = () => {
        var Kibo = new kibbo();

        Kibo.down(['a'], function() {
            console.log('A pressed');
        });

        document.addEventListener("Heartbeat", (event) => {
            /*
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
            */

            const dt = event.detail.delta
            var yMove = (dt * 300) + Math.pow(this.#fallingTime * 4, 2);

            yMove = Math.max(yMove, 3);
    
            if ((this.PlayerSprite.Position.y + yMove) < (this.#Game.Canvas.height - this.PlayerSprite.Size.y)
                && (this.PlayerSprite.Position.y + yMove) > 0) {

                    this.PlayerSprite.Position.y += yMove;

                    this.#fallingTime += dt;
                    this.#falling = true;
            } else {
                this.#fallingTime = 0;
                this.#falling = false;
            }
        });
    }
}