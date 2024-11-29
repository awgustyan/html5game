import Instance from "./Instance.js";
import Sprite from "./Sprite.js";
import VelocitySprite from "./VelocitySprite.js";
import GameService from "./GameService.js";
import Vector2 from "./Vector2.js";

export default class Enemy extends VelocitySprite {
    #Game = new GameService;

    constructor(parent, imageSrc, positionV2, sizeV2) {
        super(parent, imageSrc, positionV2, sizeV2);
    }

    Init = () => {

    }

    HeartBeatStep = (dt) => {

    }
}