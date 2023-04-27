import Coordinate from '../gameboard/Coordinate';

export default class DeploymentBoard {
  constructor(player, fleet, parent) {
    this.player = player;
    this.fleet = fleet;
    this.parent = parent;
    this.direction = 'W';
    this.hoveredCells = [];
    this.unavailableCells = [];
    this.isReady = false;
  }

  initBoard() {
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

    board.addEventListener('mouseover', (event) => {
      if (event.target.classList.contains('cell')) {
        if (this.fleet.length > 0) {
          this.selectCells(
            event.target,
            this.fleet[this.fleet.length - 1].length
          );
        }
      }
    });

    board.addEventListener('mouseout', (event) => {
      if (event.target.classList.contains('cell')) {
        this.deselectCells();
      }
    });

    board.addEventListener('wheel', (event) => {
      if (event.target.classList.contains('cell')) {
        if (this.fleet.length > 0) {
          if (this.direction === 'N') this.direction = 'W';
          else if (this.direction === 'S') this.direction = 'E';
          else if (this.direction === 'W') this.direction = 'S';
          else if (this.direction === 'E') this.direction = 'N';

          this.deselectCells();

          this.selectCells(
            event.target,
            this.fleet[this.fleet.length - 1].length
          );
        }
      }
    });

    board.addEventListener('click', (event) => {
      if (event.target.classList.contains('cell')) {
        if (this.fleet.length > 0) {
          if (
            this.hoveredCells.length ===
            this.fleet[this.fleet.length - 1].length
          ) {
            for (let i = 0; i <= this.hoveredCells.length; i++) {
              if (this.unavailableCells.includes(this.hoveredCells[i])) {
                return;
              }
            }

            this.hoveredCells.forEach((elem) => (elem.className = 'ship'));
            this.unavailableCells.push(...this.hoveredCells);
            const coord = new Coordinate(
              +event.target.dataset.coord[0],
              +event.target.dataset.coord[2]
            );
            const ship = this.fleet.pop();
            this.player.gameboard.placeShip(coord, this.direction, ship);
            this.deselectCells();

            if (this.fleet.length === 0) return 'ready';
          }
        }
      }
    });

    this.parent.replaceChildren();
    this.parent.appendChild(board);
  }

  selectCells(start, length) {
    let unavailable = false;
    const markedCells = document.querySelectorAll('.cell-unavailable');

    Array.from(markedCells).forEach((cell) =>
      cell.classList.replace('cell-unavailable', 'cell-base')
    );

    for (let i = 0; i < length; i++) {
      let nextCell;

      if (this.direction === 'N') {
        nextCell = document.querySelector(
          `[data-coord="${+start.dataset.coord[0] - i},${+start.dataset
            .coord[2]}"]`
        );
      } else if (this.direction === 'S') {
        nextCell = document.querySelector(
          `[data-coord="${+start.dataset.coord[0] + i},${+start.dataset
            .coord[2]}"]`
        );
      } else if (this.direction === 'W') {
        nextCell = document.querySelector(
          `[data-coord="${+start.dataset.coord[0]},${
            +start.dataset.coord[2] + i
          }"]`
        );
      } else if (this.direction === 'E') {
        nextCell = document.querySelector(
          `[data-coord="${+start.dataset.coord[0]},${
            +start.dataset.coord[2] - i
          }"]`
        );
      }

      if (nextCell) {
        this.hoveredCells.push(nextCell);
        nextCell.classList.replace('cell-base', 'cell-selected');

        if (this.unavailableCells.includes(nextCell) && !unavailable)
          unavailable = true;
      } else {
        this.hoveredCells.forEach((elem) =>
          elem.classList.replace('cell-selected', 'cell-unavailable')
        );
      }
    }

    if (unavailable) this.markCellsUnavailable();
  }

  deselectCells() {
    while (this.hoveredCells.length > 0) {
      const elem = this.hoveredCells.pop();
      elem.classList.replace('cell-selected', 'cell-base');
      elem.classList.replace('cell-unavailable', 'cell-base');
    }
  }

  markCellsUnavailable() {
    this.hoveredCells.forEach((cell) =>
      cell.classList.replace('cell-selected', 'cell-unavailable')
    );
  }
}
