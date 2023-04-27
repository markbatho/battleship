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
      this.parent
    );

    deploymentBoard.initBoard();
  }
}
