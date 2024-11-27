import Instance from "./Instance.js";
import Sprite from "./Sprite.js";
import VelocitySprite from "./VelocitySprite.js";
import GameService from "./GameService.js";
import Vector2 from "./Vector2.js";

export default class PlayerService {
    #Game = new GameService;

    #moveDirection = new Vector2(0, 0);
    #unitMoveDirection = new Vector2(0, 0);

    constructor() {
        if (PlayerService._instance) {
           return PlayerService._instance
        }

        PlayerService._instance = this;

        this.WalkSpeed = 60;
        this.JumpPower = 700;

        this.Player = new VelocitySprite(this.#Game.Workspace, "/assets/player.png", 50, 100, 70, 140);
    }

    jump = () => {
        this.Player.Velocity.y -= this.JumpPower;
    }

    init = () => {
        let changeMoveDir = function(x, y) {
            this.#moveDirection.x += x;
            this.#moveDirection.y += y;

            this.#unitMoveDirection = this.#moveDirection.normalize();
        }

        changeMoveDir = changeMoveDir.bind(this);

        const leftKey = 'a';
        const rightKey = 'd';
        const jumpKey = ' ';

        var keysPressed = {
            leftKey : false,
            rightKey : false,
        };

        document.addEventListener("keydown", (event) => {
              const keyName = event.key;

              if (keyName === leftKey) {
                if (!keysPressed[leftKey]) {
                    changeMoveDir(-1, 0);
                }
    
                keysPressed[leftKey] = true;
                return;
              }

              if (keyName === rightKey) {
                if (!keysPressed[rightKey]) {
                    changeMoveDir(1, 0);
                }
    
                keysPressed[rightKey] = true;
                return;
              }

                if (keyName === jumpKey) {
                    if (!keysPressed[jumpKey] && this.Player.TouchingGround) {
                        this.jump();
                    }
        
                    keysPressed[jumpKey] = true;
                }
            },
            false,
          );
          
          document.addEventListener("keyup", (event) => {
              const keyName = event.key;
          
                if (keyName === leftKey) {
                    if (keysPressed[leftKey]) {
                        changeMoveDir(1, 0);
                    }

                    keysPressed[leftKey] = false;
                }

                if (keyName === rightKey) {
                    if (keysPressed[rightKey]) {
                        changeMoveDir(-1, 0);
                    }

                    keysPressed[rightKey] = false;
                }

                if (keyName === jumpKey) {
                    keysPressed[jumpKey] = false;
                }
            },
            false,
          );
          

        document.addEventListener("Heartbeat", (event) => {
            const dt = event.detail.delta;

            document.getElementById("movedir").innerHTML = "Movedir: " + this.#unitMoveDirection;
            document.getElementById("velocity").innerHTML = "Velocity: " + this.Player.Velocity;
            document.getElementById("touchingGround").innerHTML = "Touching Ground: " + this.Player.TouchingGround;
            document.getElementById("fps").innerHTML = "FPS: " + Math.round(1 / dt);

            this.Player.Velocity.y += this.#Game.Gravity * dt;

            if (this.#unitMoveDirection.magnitude > 0) {
                if (this.Player.Velocity.x >= -this.WalkSpeed && this.Player.Velocity.x <= this.WalkSpeed) {
                    this.Player.Velocity.x += (this.#unitMoveDirection.x * this.WalkSpeed);
                }
            } else {
                this.Player.Velocity.x += (this.#unitMoveDirection.x * this.WalkSpeed) - (this.Player.Velocity.x * 0.15);
            }

            this.Player.Velocity.y = Math.min(Math.max(this.Player.Velocity.y, -3000), 400);
            this.Player.Velocity.x = Math.min(Math.max(this.Player.Velocity.x, -1000), 1000);

            this.Player.physicsStep(dt);
        });
    }
}