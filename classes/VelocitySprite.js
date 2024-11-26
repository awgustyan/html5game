import Instance from "./Instance.js";
import Vector2 from "./Vector2.js";
import GameService from "./GameService.js";
import Sprite from "./Sprite.js";

export default class VelocitySprite extends Sprite {
    #Game = new GameService;

    constructor(parent, imageSrc, xPos, yPos, xSize, ySize) {
        super(parent, imageSrc, xPos, yPos, xSize, ySize);

        this.Image = new Image;
        this.Image.src = imageSrc;

        this.Position = new Vector2(xPos, yPos);
        this.Size = new Vector2(xSize, ySize);
        this.Velocity = new Vector2(0, 0);

        this.TouchingGround = false;
    }

    physicsStep = (dt) => {
        const moveX = this.Velocity.x * dt
        const moveY = this.Velocity.y * dt
        
        // Collision checks

        const ULCorner = new Vector2(this.Position.x, this.Position.y);
        const URCorner = new Vector2(this.Position.x + this.Size.x, this.Position.y);
        const DLCorner = new Vector2(this.Position.x, this.Position.y + this.Size.y);
        const DRCorner = new Vector2(this.Position.x + this.Size.x, this.Position.y + this.Size.y);

        const Center = new Vector2(this.Position.x + (this.Size.x * 0.5), this.Position.y + (this.Size.x * 0.5));

        let wouldTouchHorizontal = function(ObjPosition, ObjSize) {
            const ULCornerObj = new Vector2(ObjPosition.x, ObjPosition.y);
            const URCornerObj = new Vector2(ObjPosition.x + ObjSize.x, ObjPosition.y);
            const DLCornerObj = new Vector2(ObjPosition.x, ObjPosition.y + ObjSize.y);
            const DRCornerObj = new Vector2(ObjPosition.x + ObjSize.x, ObjPosition.y + ObjSize.y);

            const CenterObj = new Vector2(ObjPosition.x + (ObjSize.x * 0.5), ObjPosition.y + (ObjSize.x * 0.5));
            
            if ((ULCorner.y < ULCornerObj.y && DLCorner.y < ULCornerObj.y) ||
                (ULCorner.y > DLCornerObj.y && DLCorner.y > DLCornerObj.y)) {
                    return null;
            }

            if (CenterObj.x <= Center.x) {
                if ((ULCorner.x + moveX) <= URCornerObj.x) {
                    return "left";
                }
            } else {
                if ((URCorner.x + moveX) >= ULCornerObj.x) {
                    return "right";
                }
            }

            return null;
        }

        wouldTouchHorizontal = wouldTouchHorizontal.bind(this);

        let wouldTouchVertical = function(ObjPosition, ObjSize) {
            const ULCornerObj = new Vector2(ObjPosition.x, ObjPosition.y);
            const URCornerObj = new Vector2(ObjPosition.x + ObjSize.x, ObjPosition.y);
            const DLCornerObj = new Vector2(ObjPosition.x, ObjPosition.y + ObjSize.y);
            const DRCornerObj = new Vector2(ObjPosition.x + ObjSize.x, ObjPosition.y + ObjSize.y);

            const CenterObj = new Vector2(ObjPosition.x + (ObjSize.x * 0.5), ObjPosition.y + (ObjSize.x * 0.5));
            
            if ((ULCorner.x < ULCornerObj.x && URCorner.x < ULCornerObj.x) ||
                (ULCorner.x > URCornerObj.x && URCorner.x > URCornerObj.x)) {
                    return null;
            }

            if (CenterObj.y <= Center.y) {
                if ((ULCorner.y + moveY) <= DLCornerObj.y) {
                        return "up";
                }
            } else {
                if ((DLCorner.y + moveY) >= ULCornerObj.y) {
                    return "down";
                }
            }

            return null;
        }

        wouldTouchVertical = wouldTouchVertical.bind(this);

        let wouldTouchHorizontalBorder = function() {
            if ((this.Position.x + moveX) > (this.#Game.Canvas.width - this.Size.x)) {
                return "right";
            }
    
            if ((this.Position.x + moveX) <= 0) {
                return "left";
            }

            return null;
        }

        wouldTouchHorizontalBorder = wouldTouchHorizontalBorder.bind(this);

        let wouldTouchVerticalBorder = function() {
            if ((this.Position.y + moveY) > (this.#Game.Canvas.height - this.Size.y)) {
                return "down";
            }
    
            if ((this.Position.y + moveY) <= 0) {
                return "up";
            }

            return null;
        }

        wouldTouchVerticalBorder = wouldTouchVerticalBorder.bind(this);

        let wouldTouchDirectionX = wouldTouchHorizontalBorder();
        let wouldTouchDirectionY = wouldTouchVerticalBorder();

        for (let i = 0; i < this.#Game.Enviroment.length; i++) {
            let obj = this.#Game.Enviroment[i];
            
            if (wouldTouchDirectionX && wouldTouchDirectionY) {
                break;
            }

            if (!wouldTouchDirectionX) {
                wouldTouchDirectionX = wouldTouchHorizontal(obj.Position, obj.Size);
            }
            
            if (!wouldTouchDirectionY) {
                wouldTouchDirectionY = wouldTouchVertical(obj.Position, obj.Size);
            }
        }

        if (!wouldTouchDirectionX) {
            this.Position.x += moveX;
        } else {
            if (wouldTouchDirectionX == "right") {
                //this.Position.x = (this.#Game.Canvas.width - this.Size.x)
                this.Velocity.x = 0
            } else if (wouldTouchDirectionX == "left") {
                //this.Position.x = 0
                this.Velocity.x = 0
            }
        }

        if (!wouldTouchDirectionY) {
            this.Position.y += moveY;

            this.TouchingGround = false;
        } else {
            if (wouldTouchDirectionY == "up") {
                //    
                this.Velocity.y = 0
            } else if (wouldTouchDirectionY == "down") {
                //
                this.TouchingGround = true;
                
                this.Velocity.y = 0
            }
        }
    }
}