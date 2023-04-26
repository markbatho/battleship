import Coordinate from '../gameboard/Coordinate';
import Ship from '../ship/Ship';

export default class GameManager {
  constructor(player, computer, parent) {
    this.player = player;
    this.computer = computer;
    this.parent = parent;
    this.playerBoard = null;
    this.computerBoard = null;
  }

  renderDeploymentBoard() {
    const fleet = [
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];

    const board = document.createElement('div');
    board.className = 'board';

    for (let i = 0; i < this.player.gameboard.size; i++) {
      for (let j = 0; j < this.player.gameboard.size; j++) {
        const cell = document.createElement('div');
        cell.className = 'placement-cell';
        cell.dataset.coord = [i, j];
        board.appendChild(cell);
      }
    }

    let activeCells = [];
    let dir = 'W';

    function selectCells(start, dir, length) {
      for (let i = 0; i < length; i++) {
        let nextCell;

        if (dir === 'N') {
          nextCell = document.querySelector(
            `[data-coord="${+start.dataset.coord[0] - i},${+start.dataset
              .coord[2]}"]`
          );
        } else if (dir === 'S') {
          nextCell = document.querySelector(
            `[data-coord="${+start.dataset.coord[0] + i},${+start.dataset
              .coord[2]}"]`
          );
        } else if (dir === 'W') {
          nextCell = document.querySelector(
            `[data-coord="${+start.dataset.coord[0]},${
              +start.dataset.coord[2] + i
            }"]`
          );
        } else if (dir === 'E') {
          nextCell = document.querySelector(
            `[data-coord="${+start.dataset.coord[0]},${
              +start.dataset.coord[2] - i
            }"]`
          );
        }

        if (nextCell) {
          activeCells.push(nextCell);
          nextCell.style.backgroundColor = '#ccc';
        } else {
          activeCells.forEach((elem) => (elem.style.backgroundColor = 'red'));
          start.style.cursor = 'not-allowed';
        }
      }
    }

    function deselectCells() {
      while (activeCells.length > 0) {
        const elem = activeCells.pop();
        elem.style.backgroundColor = '#f2f2f2';
        elem.style.cursor = 'auto';
      }
    }

    board.addEventListener('mouseover', (event) => {
      if (event.target.classList.contains('placement-cell')) {
        if (fleet.length > 0) {
          selectCells(event.target, dir, fleet[fleet.length - 1].length);
          console.log('called?');
        }
      }
    });

    board.addEventListener('mouseout', (event) => {
      if (event.target.classList.contains('placement-cell')) {
        deselectCells();
      }
    });

    board.addEventListener('wheel', (event) => {
      if (event.target.classList.contains('placement-cell')) {
        if (fleet.length > 0) {
          if (dir === 'N') dir = 'W';
          else if (dir === 'S') dir = 'E';
          else if (dir === 'W') dir = 'S';
          else if (dir === 'E') dir = 'N';

          deselectCells();
          selectCells(event.target, dir, fleet[fleet.length - 1].length);
        }
      }
    });

    board.addEventListener('click', (event) => {
      if (event.target.classList.contains('placement-cell')) {
        if (fleet.length > 0) {
          if (activeCells.length === fleet[fleet.length - 1].length) {
            activeCells.forEach((elem) => (elem.className = 'ship'));
            const coord = new Coordinate(
              +event.target.dataset.coord[0],
              +event.target.dataset.coord[2]
            );
            const ship = fleet.pop();
            this.player.gameboard.placeShip(coord, dir, ship);
            deselectCells();
          }
        }
      }
    });

    this.parent.replaceChildren();
    this.parent.appendChild(board);
  }
}
