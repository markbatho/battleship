import Coordinate from '../gameboard/Coordinate';
import Ship from '../ship/Ship';

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

    const board = document.createElement('div');
    board.className = 'board';

    for (let i = 0; i < this.player.gameboard.size; i++) {
      for (let j = 0; j < this.player.gameboard.size; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell cell-base';
        cell.dataset.coord = [i, j];
        board.appendChild(cell);
      }
    }

    let activeCells = [];
    let dir = 'W';

    function selectCells(start, dir, length) {
      const markedCells = document.querySelectorAll('.cell-unavailable');
      Array.from(markedCells).forEach((cell) =>
        cell.classList.replace('cell-unavailable', 'cell-base')
      );

      let unavailable = false;

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
          nextCell.classList.replace('cell-base', 'cell-selected');

          if (this.unavailableCells.includes(nextCell) && !unavailable)
            unavailable = true;
        } else {
          activeCells.forEach((elem) =>
            elem.classList.replace('cell-selected', 'cell-unavailable')
          );
        }
      }

      if (unavailable) markCellsUnavailable();
    }

    function deselectCells() {
      while (activeCells.length > 0) {
        const elem = activeCells.pop();
        elem.classList.replace('cell-selected', 'cell-base');
      }
    }

    function markCellsUnavailable() {
      activeCells.forEach((cell) =>
        cell.classList.replace('cell-selected', 'cell-unavailable')
      );
    }

    board.addEventListener('mouseover', (event) => {
      if (event.target.classList.contains('cell')) {
        if (fleet.length > 0) {
          selectCells.call(
            this,
            event.target,
            dir,
            fleet[fleet.length - 1].length
          );
        }
      }
    });

    board.addEventListener('mouseout', (event) => {
      if (event.target.classList.contains('cell')) {
        deselectCells();
      }
    });

    board.addEventListener('wheel', (event) => {
      if (event.target.classList.contains('cell')) {
        if (fleet.length > 0) {
          if (dir === 'N') dir = 'W';
          else if (dir === 'S') dir = 'E';
          else if (dir === 'W') dir = 'S';
          else if (dir === 'E') dir = 'N';

          deselectCells();
          selectCells.call(
            this,
            event.target,
            dir,
            fleet[fleet.length - 1].length
          );
        }
      }
    });

    board.addEventListener('click', (event) => {
      if (event.target.classList.contains('cell')) {
        if (fleet.length > 0) {
          if (activeCells.length === fleet[fleet.length - 1].length) {
            for (let i = 0; i <= activeCells.length; i++) {
              if (this.unavailableCells.includes(activeCells[i])) {
                return;
              }
            }
            console.log(activeCells);
            activeCells.forEach((elem) => (elem.className = 'ship'));
            this.unavailableCells.push(...activeCells);
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
