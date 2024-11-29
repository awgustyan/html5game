import GameService from "./classes/GameService.js";
import PlayerService from "./classes/PlayerService.js";

const Game = new GameService;
const Player = new PlayerService;

Game.Init();
Player.Init();