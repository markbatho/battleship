import './style.css';

import Gameboard from './components/gameboard/Gameboard';
import Player from './components/player/Player';
import GameManager from './components/gamemanager/GameManager';

const app = document.getElementById('app');
const header = document.createElement('header');
const boardContainer = document.createElement('div');
const title = document.createElement('h1');
title.textContent = 'Battleship';
header.appendChild(title);
app.appendChild(header);
app.appendChild(boardContainer);

const playerBoard = new Gameboard();
const player = new Player(playerBoard);
const computerBoard = new Gameboard();
const computer = new Player(computerBoard);
const gameManager = new GameManager(player, computer, boardContainer);

gameManager.renderDeploymentBoard();
