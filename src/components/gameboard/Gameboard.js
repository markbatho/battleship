export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.missedShots = [];
    this.ships = [];
  }

  receiveAttack(x, y) {}

  placeShip(x, y, z, ship) {}
}
