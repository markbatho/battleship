import Coordinate from './Coordinate';
import GameboardObject from './GameboardObject';

export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.shots = [];
    this.missedShots = [];
  }

  receiveAttack(coord) {
    // Check coordinate
    if (!this.validateCoords([coord])) throw new Error('Invalid coordinate');
    if (this.shots.find((elem) => elem.isEqual(coord)))
      throw new Error('Already hit coordinate');
    if (this.missedShots.find((elem) => elem.isEqual(coord)))
      throw new Error('Already hit coordinate');

    for (let i = 0; i < this.ships.length; i++) {
      for (let j = 0; j < this.ships[i].coords.length; j++) {
        if (this.ships[i].coords[j].isEqual(coord)) {
          this.ships[i].ship.hit();
          this.ships[i].ship.isSunk();
          this.shots.push(coord);
          return;
        }
      }
    }

    this.missedShots.push(coord);
  }

  placeShip(coord, dir, ship) {
    const coords = this.getCoords(coord, dir, ship.length);

    if (!this.validateCoords(coords)) throw new Error('Invalid coordinate');
    if (!this.validateCoordsAvailable(coords))
      throw new Error('Coordinate not available');

    this.ships.push(new GameboardObject(coords, ship));
  }

  getCoords(coord, dir, length) {
    const coords = [];

    for (let i = 0; i < length; i++) {
      switch (dir) {
        case 'N':
          coords.push(new Coordinate(coord.x, coord.y + i));
          break;
        case 'S':
          coords.push(new Coordinate(coord.x, coord.y - i));
          break;
        case 'W':
          coords.push(new Coordinate(coord.x - i, coord.y));
          break;
        case 'E':
          coords.push(new Coordinate(coord.x + i, coord.y));
          break;
      }
    }

    return coords;
  }

  validateCoords(coords) {
    for (let i = 0; i < coords.length; i++) {
      if (coords[i].x >= this.size || coords[i].y >= this.size) {
        return false;
      } else if (coords[i].x < 0 || coords[i].y < 0) {
        return false;
      }
    }

    return true;
  }

  validateCoordsAvailable(coords) {
    for (let i = 0; i < coords.length; i++) {
      for (let j = 0; j < this.ships.length; j++) {
        if (this.ships[j].coords.inlude(coords[i])) return false;
      }
    }

    return true;
  }
}
