import Coordinate from './Coordinate';
import GameboardObject from './GameboardObject';

export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.shots = [];
    this.missedShots = [];
    this.availableCoords = this.init();
  }

  init() {
    const coords = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        coords.push(new Coordinate(i, j));
      }
    }
    return coords;
  }

  removeAvailableCoord(coord) {
    // const index = this.availableCoords.indexOf(
    //   (element) => element[0] === coord.x && element[1] === coord.y
    // );
    // this.availableCoords.splice(index, 1);

    const index = this.availableCoords.findIndex((element) => {
      return element.isEqual(coord);
    });

    this.availableCoords.splice(index, 1);
  }

  receiveAttack(coord) {
    // Check coordinate
    if (!this.validateCoords([coord])) throw new Error('Invalid coordinate');
    if (this.shots.find((elem) => elem.isEqual(coord)))
      throw new Error('Already hit coordinate');
    if (
      this.missedShots.find((elem) => {
        elem.isEqual(coord);
      })
    )
      throw new Error('Already hit coordinate');

    for (let i = 0; i < this.ships.length; i++) {
      for (let j = 0; j < this.ships[i].coords.length; j++) {
        if (this.ships[i].coords[j].isEqual(coord)) {
          this.ships[i].ship.hit();
          this.ships[i].ship.isSunk();
          this.removeAvailableCoord(coord);
          this.shots.push(coord);
          return true;
        }
      }
    }

    this.removeAvailableCoord(coord);
    this.missedShots.push(coord);
    return false;
  }

  placeShip(coord, dir, ship) {
    const coords = this.getCoords(coord, dir, ship.length);

    if (!this.validateCoords(coords)) throw new Error('Invalid coordinate');
    if (!this.validateCoordsAvailable(coords))
      throw new Error('Coordinate not available');

    this.ships.push(new GameboardObject(coords, ship));
    return true;
  }

  autoPlaceFleet(fleet) {
    const directions = ['N', 'S', 'W', 'E'];
    const min = 0;
    const dirMax = directions.length;
    const sizeMax = this.size;

    while (fleet.length > 0) {
      try {
        const dir = Math.floor(Math.random() * (dirMax - min) + min);
        const x = Math.floor(Math.random() * (sizeMax - min) + min);
        const y = Math.floor(Math.random() * (sizeMax - min) + min);
        const coord = new Coordinate(x, y);

        if (this.placeShip(coord, directions[dir], fleet[fleet.length - 1])) {
          fleet.pop();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  getCoords(coord, dir, length) {
    const coords = [];

    for (let i = 0; i < length; i++) {
      switch (dir) {
        case 'N':
          coords.push(new Coordinate(coord.x - i, coord.y));
          break;
        case 'S':
          coords.push(new Coordinate(coord.x + i, coord.y));
          break;
        case 'W':
          coords.push(new Coordinate(coord.x, coord.y + i));
          break;
        case 'E':
          coords.push(new Coordinate(coord.x, coord.y - i));
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
        if (
          this.ships[j].coords.find(
            (elem) => elem.x === coords[i].x && elem.y === coords[i].y
          )
        )
          return false;
      }
    }
    return true;
  }

  resetBoard() {
    this.ships = [];
    this.shots = [];
    this.missedShots = [];
    this.availableCoords = this.init();
  }
}
