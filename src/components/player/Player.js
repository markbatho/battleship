import Coordinate from '../gameboard/Coordinate';

export default class Player {
  constructor(gameboard) {
    this.gameboard = gameboard;
    this.queue = [];
  }

  manualAttack(coord) {
    this.gameboard.receiveAttack(coord);
  }

  autoAttack() {
    let coord;

    if (this.queue.length > 0) {
      coord = this.queue.unshift();
    } else {
      const min = 0;
      const max = this.gameboard.availableCoords.length;
      const index = Math.floor(Math.random() * (max - min) + min);

      coord = new Coordinate(this.gameboard.availableCoords[index]);
    }

    const hit = this.gameboard.receiveAttack(coord);

    if (hit) {
      const coords = [];

      coords.push(new Coordinate(coord.x, coord.y + 1));
      coords.push(new Coordinate(coord.x, coord.y - 1));
      coords.push(new Coordinate(coord.x - 1, coord.y));
      coords.push(new Coordinate(coord.x + 1, coord.y));

      for (let i = 0; i < coords.length; i++) {
        const index = this.gameboard.availableCoords.indexOf(
          (element) => element[0] === coords[i].x && element[1] === coords[i].y
        );

        if (index) this.queue.push(coords[i]);
      }
    }
  }
}
