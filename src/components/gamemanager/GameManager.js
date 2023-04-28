import Ship from '../ship/Ship';
import DeploymentBoard from './DeploymentBoard';

export default class GameManager {
  constructor(player, computer, parent) {
    this.player = player;
    this.computer = computer;
    this.parent = parent;
    this.unavailableCells = [];
  }

  renderDeploymentBoard() {
    const fleet = [
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];

    const deploymentBoard = new DeploymentBoard(
      this.player,
      fleet,
      this.parent,
      this.startGame,
      this
    );

    deploymentBoard.initBoard();
  }

  renderBoard(gameboard, parent) {
    // Render cells
    // Iterate over GameboardObjects' coords, place coord on board
    for (let i = 0; i < gameboard.size; i++) {
      for (let j = 0; j < gameboard.size; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell cell-base';
        cell.dataset.coord = [i, j];
        parent.appendChild(cell);
      }
    }

    gameboard.ships.forEach((ship) => {
      ship.coords.forEach((coord) => {
        const cell = parent.querySelector(
          `[data-coord="${coord.x},${coord.y}"]`
        );
        cell.className = 'ship';
      });
    });
  }

  startGame() {
    this.parent.replaceChildren();

    const boardContainer = document.createElement('div');
    boardContainer.id = 'boardContainer';

    const playerBoard = document.createElement('div');
    playerBoard.classList.add('board');
    this.renderBoard(this.player.gameboard, playerBoard);

    const computerBoard = document.createElement('div');
    computerBoard.classList.add('board');
    this.renderBoard(this.computer.gameboard, computerBoard);

    const restartGame = document.createElement('button');
    restartGame.textContent = 'Restart Game';
    restartGame.addEventListener('click', () => {
      this.player.gameboard.resetBoard();
      this.computer.gameboard.resetBoard();
      this.parent.replaceChildren();
      this.renderDeploymentBoard();
    });

    boardContainer.appendChild(playerBoard);
    boardContainer.appendChild(computerBoard);
    this.parent.appendChild(boardContainer);
    this.parent.appendChild(restartGame);
  }
}
