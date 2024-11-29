import Instance from "./Instance.js";
import Vector2 from "./Vector2.js";
import GameService from "./GameService.js";
import Sprite from "./Sprite.js";

export default class VelocitySprite extends Sprite {
    #Game = new GameService;

    constructor(parent, imageSrc, positionV2, sizeV2) {
        super(parent, imageSrc, positionV2, sizeV2);

        this.Image = new Image;
        this.Image.src = imageSrc;

        this.Position = positionV2;
        this.Size = sizeV2;
        this.Velocity = new Vector2(0, 0);

        this.TouchingGround = false;
        this.FallStartTime = 0;
    }

    PhysicsStep = (dt) => {
        const moveX = this.Velocity.x * dt
        const moveY = this.Velocity.y * dt
        
        // Collision checks

        const ULCorner = new Vector2(this.Position.x, this.Position.y);
        const URCorner = new Vector2(this.Position.x + this.Size.x, this.Position.y);
        const DLCorner = new Vector2(this.Position.x, this.Position.y + this.Size.y);
        const DRCorner = new Vector2(this.Position.x + this.Size.x, this.Position.y + this.Size.y);

        const Center = new Vector2(this.Position.x + (this.Size.x * 0.5), this.Position.y + (this.Size.x * 0.5));

        let wouldTouchHorizontal = function(Obj) {
            const ULCornerObj = new Vector2(Obj.Position.x, Obj.Position.y);
            const URCornerObj = new Vector2(Obj.Position.x + Obj.Size.x, Obj.Position.y);
            const DLCornerObj = new Vector2(Obj.Position.x, Obj.Position.y + Obj.Size.y);
            const DRCornerObj = new Vector2(Obj.Position.x + Obj.Size.x, Obj.Position.y + Obj.Size.y);

            const CenterObj = new Vector2(Obj.Position.x + (Obj.Size.x * 0.5), Obj.Position.y + (Obj.Size.y * 0.5));
            
            if ((ULCorner.y < ULCornerObj.y && DLCorner.y < ULCornerObj.y) ||
                (ULCorner.y > DLCornerObj.y && DLCorner.y > DLCornerObj.y)) {
                    return null;
            }

            if (CenterObj.x <= Center.x) {
                if ((ULCorner.x + moveX) < URCornerObj.x) {
                    return {direction : "left", collisionCordinate : URCornerObj.x, obj : Obj};
                }
            } else {
                if ((URCorner.x + moveX) > ULCornerObj.x) {
                    return {direction : "right", collisionCordinate : ULCornerObj.x - this.Size.x, obj : Obj};
                }
            }

            return null;
        }

        wouldTouchHorizontal = wouldTouchHorizontal.bind(this);

        let wouldTouchVertical = function(Obj) {
            const ULCornerObj = new Vector2(Obj.Position.x, Obj.Position.y);
            const URCornerObj = new Vector2(Obj.Position.x + Obj.Size.x, Obj.Position.y);
            const DLCornerObj = new Vector2(Obj.Position.x, Obj.Position.y + Obj.Size.y);
            const DRCornerObj = new Vector2(Obj.Position.x + Obj.Size.x, Obj.Position.y + Obj.Size.y);

            const CenterObj = new Vector2(Obj.Position.x + (Obj.Size.x * 0.5), Obj.Position.y + (Obj.Size.y * 0.5));
            
            if ((ULCorner.x < ULCornerObj.x && URCorner.x < ULCornerObj.x) ||
                (ULCorner.x > URCornerObj.x && URCorner.x > URCornerObj.x)) {
                    return null;
            }

            if (CenterObj.y <= Center.y) {
                if ((ULCorner.y + moveY) < DLCornerObj.y) {
                    return {direction : "up", collisionCordinate : DLCornerObj.y, obj : Obj};
                }
            } else {
                if ((DLCorner.y + moveY) > ULCornerObj.y) {
                    return {direction : "down", collisionCordinate : ULCornerObj.y  - this.Size.y, obj : Obj};
                }
            }

            return null;
        }

        wouldTouchVertical = wouldTouchVertical.bind(this);

        let wouldTouchHorizontalBorder = function() {
            if ((this.Position.x + moveX) > (this.#Game.Canvas.width - this.Size.x)) {
                return {direction : "right", collisionCordinate : (this.#Game.Canvas.width - this.Size.x), obj : null};
            }
    
            if ((this.Position.x + moveX) <= 0) {
                return {direction : "left", collisionCordinate : 0, obj : null};
            }

            return null;
        }

        wouldTouchHorizontalBorder = wouldTouchHorizontalBorder.bind(this);

        let wouldTouchVerticalBorder = function() {
            if ((this.Position.y + moveY) > (this.#Game.Canvas.height - this.Size.y)) {
                return {direction : "down", collisionCordinate : (this.#Game.Canvas.height - this.Size.y), obj : null};
            }
    
            if ((this.Position.y + moveY) <= 0) {
                return {direction : "up", collisionCordinate : 0, obj : null};
            }

            return null;
        }

        wouldTouchVerticalBorder = wouldTouchVerticalBorder.bind(this);

        let CollisionDataX = wouldTouchHorizontalBorder();
        let CollisionDataY = wouldTouchVerticalBorder();

        for (let i = 0; i < this.#Game.Workspace.Children.length; i++) {
            let obj = this.#Game.Workspace.Children[i];

            if (!obj.CanCollide) {
                continue;
            }
            
            if (CollisionDataX && CollisionDataY) {
                break;
            }

            if (!CollisionDataX) {
                CollisionDataX = wouldTouchHorizontal(obj);
            }
            
            if (!CollisionDataY) {
                CollisionDataY = wouldTouchVertical(obj);
            }
        }

        if (!CollisionDataX) {
            this.Position.x += moveX;
        } else {
            //this.Position.x = CollisionDataX.collisionCordinate

            document.dispatchEvent(new CustomEvent("CollisionX", {
                detail: {owner: this, direction: CollisionDataX.direction, obj: CollisionDataX.obj}
            }));

            this.Velocity.x = 0;
        }

        if (!CollisionDataY) {
            this.Position.y += moveY;

            this.TouchingGround = false;
            this.FallStartTime
        } else {
            //this.Position.y = CollisionDataY.collisionCordinate            
            document.dispatchEvent(new CustomEvent("CollisionX", {
                detail: {owner: this, direction: CollisionDataY.direction, obj: CollisionDataY.obj}
            }));

            this.Velocity.y = -this.Velocity.y + 100;
            
            if (Math.abs(this.Velocity.y) > 100) {
                this.Velocity.x += Math.sign(this.Velocity.x) * (Math.abs(this.Velocity.y) * 0.7);
            }

            if (CollisionDataY.direction == "down") {
                this.TouchingGround = true;
            }
        }
    }
}