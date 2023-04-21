export default class Gameboard {
  DIRECTIONS = ['N', 'S', 'W', 'E'];

  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.missedShots = [];
  }

  receiveAttack(x, y) {}

  placeShip(x, y, z, ship) {
  }
}
