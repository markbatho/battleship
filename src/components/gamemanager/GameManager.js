import Coordinate from '../gameboard/Coordinate';
import Ship from '../ship/Ship';
import DeploymentBoard from './DeploymentBoard';

export default class GameManager {
  constructor(player, computer, parent, updateMessageCb) {
    this.player = player;
    this.computer = computer;
    this.parent = parent;
    this.unavailableCells = [];
    this.updateMessageCb = updateMessageCb;
    this.playerTurn = true;
    this.isWinner = false;
  }

  renderDeploymentBoard() {
    const fleet = [
      new Ship(2, 'patrolboat'),
      new Ship(3, 'submarine'),
      new Ship(3, 'destroyer'),
      new Ship(4, 'battleship'),
      new Ship(5, 'carrier'),
    ];

    const deploymentBoard = new DeploymentBoard(
      this.player,
      fleet,
      this.parent,
      this.startGame,
      this.updateMessageCb,
      this
    );

    deploymentBoard.initBoard();
  }

  // TODO: Clean it up / Refactor
  renderBoard(gameboard, parent, playerBoardX = false, opponentBoard = null) {
    for (let i = 0; i < gameboard.size; i++) {
      for (let j = 0; j < gameboard.size; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell cell-base';
        cell.dataset.coord = [i, j];

        if (!playerBoardX) {
          cell.classList.add('cell-opponent');
          cell.addEventListener('click', () => {
            console.log(this.isWinner);
            const coord = new Coordinate(
              +cell.dataset.coord[0],
              +cell.dataset.coord[2]
            );

            if (!this.isWinner) {
              if (this.playerTurn) {
                this.playerTurn = false;

                const cellCoord = this.computer.gameboard.availableCoords.find(
                  (element) => {
                    return element.isEqual(coord);
                  }
                );

                if (cellCoord) {
                  this.updateMessageCb('Player shooting...');
                  cell.classList.add('cell-receivedshot');

                  setTimeout(() => {
                    cell.classList.remove('cell-receivedshot');
                    if (this.computer.manualAttack(coord)) {
                      cell.classList.add('cell-hit');
                      this.updateMessageCb('Hit!');
                    } else {
                      cell.classList.add('cell-missed');
                      this.updateMessageCb('Missed');
                    }

                    this.evalIsWinner();

                    const a = this.player.gameboard.getShipsLength();
                    const b = this.computer.gameboard.getShipsLength();

                    if (this.isWinner) {
                      if (a < b) {
                        this.updateMessageCb('Comp win');
                      } else {
                        this.updateMessageCb('Player win');
                      }
                    }

                    if (!this.isWinner) {
                      setTimeout(() => {
                        this.updateMessageCb('Computer is shooting...');

                        const computerAttack = this.player.autoAttack();
                        const playerCell = opponentBoard.querySelector(
                          `[data-coord="${computerAttack.coord.x},${computerAttack.coord.y}"]`
                        );

                        playerCell.classList.add('cell-receivedshot');

                        setTimeout(() => {
                          playerCell.classList.remove('cell-receivedshot');
                          if (computerAttack.hit) {
                            playerCell.classList.add('cell-hit');
                            this.updateMessageCb('Hit!');
                          } else {
                            playerCell.classList.add('cell-missed');
                            this.updateMessageCb('Missed');
                          }

                          this.playerTurn = true;
                          this.evalIsWinner();

                          setTimeout(() => {
                            this.updateMessageCb('Your turn!');

                            if (this.isWinner) {
                              const a = this.player.gameboard.getShipsLength();
                              const b =
                                this.computer.gameboard.getShipsLength();
                              if (a < b) {
                                this.updateMessageCb('Comp win');
                              } else {
                                this.updateMessageCb('Player win');
                              }
                            }
                          }, 100);
                        }, 100);
                      }, 100);
                    }
                  }, 100);
                } else {
                  setTimeout(() => {
                    this.playerTurn = true;
                  }, 100);
                }
              }
            }
          });
        }

        parent.appendChild(cell);
      }
    }

    if (playerBoardX) {
      gameboard.ships.forEach((gameboardObject) => {
        gameboardObject.coords.forEach((coord) => {
          const cell = parent.querySelector(
            `[data-coord="${coord.x},${coord.y}"]`
          );

          cell.classList.add('ship', gameboardObject.ship.type);
        });
      });
    }
  }

  evalIsWinner() {
    if (this.player.gameboard.getShipsLength() === 0) {
      this.isWinner = true;
    }
    if (this.computer.gameboard.getShipsLength() === 0) {
      this.isWinner = true;
    }
  }

  startGame() {
    this.parent.replaceChildren();

    this.updateMessageCb("Aim at the opponent's board!");

    const fleet = [
      new Ship(2, 'patrolboat'),
      new Ship(3, 'submarine'),
      new Ship(3, 'destroyer'),
      new Ship(4, 'battleship'),
      new Ship(5, 'carrier'),
    ];
    this.computer.gameboard.autoPlaceFleet(fleet);

    const boardContainer = document.createElement('div');
    boardContainer.id = 'boardContainer';

    const playerBoard = document.createElement('div');
    playerBoard.classList.add('board');
    this.renderBoard(this.player.gameboard, playerBoard, true);

    const computerBoard = document.createElement('div');
    computerBoard.classList.add('board');
    this.renderBoard(
      this.computer.gameboard,
      computerBoard,
      false,
      playerBoard
    );

    const restartGame = document.createElement('button');
    restartGame.textContent = 'Restart Game';
    restartGame.addEventListener('click', () => {
      this.isWinner = false;
      this.playerTurn = true;
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
