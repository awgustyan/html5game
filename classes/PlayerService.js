import Instance from "./Instance.js";
import Sprite from "./Sprite.js";
import GameService from "./GameService.js";
import InputService from "./InputService.js";
import Vector2 from "./Vector2.js";

export default class PlayerService {
    #Game = new GameService;

    #velocity = new Vector2(0, 0);

    #touchingGround = false;

    #moveDirection = new Vector2(0, 0);
    #unitMoveDirection = new Vector2(0, 0);

    constructor() {
        if (PlayerService._instance) {
           return PlayerService._instance
        }

        PlayerService._instance = this;

        this.WalkSpeed = 60;
        this.JumpPower = 500;

        this.PlayerSprite = new Sprite(this.#Game.Workspace, "/assets/player.png", 50, 100, 70, 140);
    }

    jump = () => {
        this.#velocity.y -= this.JumpPower;
    }

    init = () => {
        var Input = new InputService();

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
                    if (!keysPressed[jumpKey] && this.#touchingGround) {
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
            document.getElementById("velocity").innerHTML = "Velocity: " + this.#velocity;
            
            this.#velocity.y += this.#Game.Gravity * dt;

            if (this.#unitMoveDirection.magnitude > 0) {
                if (this.#velocity.x >= -this.WalkSpeed && this.#velocity.x <= this.WalkSpeed) {
                    this.#velocity.x += (this.#unitMoveDirection.x * this.WalkSpeed);
                }
            } else {
                this.#velocity.x += (this.#unitMoveDirection.x * this.WalkSpeed) - (this.#velocity.x * 0.15);
            }

            this.#velocity.y = Math.min(Math.max(this.#velocity.y, -3000), 400);
            this.#velocity.x = Math.min(Math.max(this.#velocity.x, -1000), 1000);

            const moveX = this.#velocity.x * dt
            const moveY = this.#velocity.y * dt
            
            // Collision checks

            let wouldTouchHorizontalBorder = function() {
                if ((this.PlayerSprite.Position.x + moveX) > (this.#Game.Canvas.width - this.PlayerSprite.Size.x)) {
                    return true, "right";
                }
        
                if ((this.PlayerSprite.Position.x + moveX) <= 0) {
                    return true, "left";
                }

                return false, null;
            }

            let wouldTouchVerticalBorder = function() {
                if ((this.PlayerSprite.Position.y + moveY) > (this.#Game.Canvas.height - this.PlayerSprite.Size.y)) {
                    return true, "down";
                }
        
                if ((this.PlayerSprite.Position.y + moveY) <= 0) {
                    return true, "up";
                }

                return false, null;
            }

            let wouldTouchHorizontal = function(Position, Size) {
                if ((this.PlayerSprite.Position.x + moveX) <= Position.x) {
                    return true, "left";
                }

                if ((this.PlayerSprite.Position.x + moveX) > (this.#Game.Canvas.width - this.PlayerSprite.Size.x)) {
                    return true, "right";
                }

                return false, null;
            }

            let wouldTouchVertical = function() {
                if ((this.PlayerSprite.Position.y + moveY) > (this.#Game.Canvas.height - this.PlayerSprite.Size.y)) {
                    return true, "down";
                }
        
                if ((this.PlayerSprite.Position.y + moveY) <= 0) {
                    return true, "up";
                }

                return false, null;
            }


            if ((this.PlayerSprite.Position.y + moveY) <= (this.#Game.Canvas.height - this.PlayerSprite.Size.y)) {
                this.#touchingGround = false;

                this.PlayerSprite.Position.y += moveY;
            } else {
                this.#touchingGround = true;

                this.PlayerSprite.Position.y = (this.#Game.Canvas.height - this.PlayerSprite.Size.y)
                this.#velocity.y = 0
            }
    
            if ((this.PlayerSprite.Position.y + moveY) > 0) {
                this.PlayerSprite.Position.y += moveY;
            } else {
                this.PlayerSprite.Position.y = 0
                this.#velocity.y = 0
            }

            if ((this.PlayerSprite.Position.x + moveX) < (this.#Game.Canvas.width - this.PlayerSprite.Size.x)
                && (this.PlayerSprite.Position.x + moveX) > 0) {
                    this.PlayerSprite.Position.x += moveX;
            } else {
                this.#velocity.x = 0
            }
        });
    }
}