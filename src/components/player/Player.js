import Coordinate from '../gameboard/Coordinate';

export default class Player {
  constructor(gameboard) {
    this.gameboard = gameboard;
    this.queue = [];
  }

  manualAttack(coord) {
    return this.gameboard.receiveAttack(coord);
  }

  autoAttack() {
    let coord;

    if (this.queue.length > 0) {
      coord = this.queue.shift();
    } else {
      const min = 0;
      const max = this.gameboard.availableCoords.length;
      const index = Math.floor(Math.random() * (max - min) + min);

      coord = this.gameboard.availableCoords[index];
    }

    const hit = this.gameboard.receiveAttack(coord);

    if (hit) {
      this.queue = [];
      const coords = [];

      coords.push(new Coordinate(coord.x - 1, coord.y));
      coords.push(new Coordinate(coord.x + 1, coord.y));
      coords.push(new Coordinate(coord.x, coord.y - 1));
      coords.push(new Coordinate(coord.x, coord.y + 1));

      this.shuffle(coords);

      for (let i = 0; i < coords.length; i++) {
        const elem = this.gameboard.availableCoords.find((element) => {
          return element.isEqual(coords[i]);
        });

        if (elem) this.queue.push(coords[i]);
      }
    }

    return { coord, hit };
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
