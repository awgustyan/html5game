import Instance from ".Instance.js";
import GameService from ".GameService.js";
import Enemy from ".Enemy.js";
import Vector2 from ".Vector2.js";

export default class Roomba extends Enemy {
    #Game = new GameService;

    constructor(parent, imageSrc, positionV2, sizeV2) {
        super(parent, imageSrc, positionV2, sizeV2);
    }

    Init = () => {
        
    }

    HeartBeatStep = (dt) => {

    }
}