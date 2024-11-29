import Instance from "../Instance.js";
import GameService from "../GameService.js";
import VelocitySprite from "../VelocitySprite.js";
import Vector2 from "../Vector2.js";

export default class Roomba extends VelocitySprite {
    #Game = new GameService;

    #moveDirection = new Vector2(1, 0);

    constructor(parent, imageSrc, zIndex, positionV2, sizeV2, CanCollide) {
        super(parent, imageSrc, zIndex, positionV2, sizeV2, CanCollide);

        this.WalkSpeed = 5;

        this.Init();
    }

    Init = () => {
        document.addEventListener("Heartbeat", (event) => {
            const dt = event.detail.delta;

            this.HeartBeatStep(dt);
        });

        document.addEventListener("CollisionX", (event) => {
            if (event.detail.owner != this) {
                return;
            }

            this.#moveDirection.x *= -1;
        });
    }

    HeartBeatStep = (dt) => {
        this.Velocity.y += this.#Game.Gravity * dt;

        if (this.#moveDirection.magnitude > 0) {
            if (this.Velocity.x >= -this.WalkSpeed && this.Velocity.x <= this.WalkSpeed) {
                this.Velocity.x += (this.#moveDirection.x * this.WalkSpeed);
            }
        } else {
            this.Velocity.x += (this.#moveDirection.x * this.WalkSpeed) - (this.Velocity.x * 0.15);
        }

        this.Velocity.y = Math.min(Math.max(this.Velocity.y, -3000), 450);
        this.Velocity.x = Math.min(Math.max(this.Velocity.x, -1000), 1000);

        this.PhysicsStep(dt);
    }

    Destroy = () => {
        this.Destroying = true;
    }
}