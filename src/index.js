import './style.css';

import Gameboard from './components/gameboard/Gameboard';
import Player from './components/player/Player';
import GameManager from './components/gamemanager/GameManager';

const app = document.getElementById('app');
const header = document.createElement('header');
const messageContainer = document.createElement('div');
const message = document.createElement('p');
const boardContainer = document.createElement('div');
const title = document.createElement('h1');

title.textContent = 'Battleship';

header.appendChild(title);

messageContainer.className = 'message-container';
messageContainer.appendChild(message);

function updateMessage(newMessage) {
  message.textContent = newMessage;
}

app.appendChild(header);
app.appendChild(messageContainer);
app.appendChild(boardContainer);

const playerBoard = new Gameboard();
const player = new Player(playerBoard);
const computerBoard = new Gameboard();
const computer = new Player(computerBoard);
const gameManager = new GameManager(
  player,
  computer,
  boardContainer,
  updateMessage
);

gameManager.renderDeploymentBoard();
