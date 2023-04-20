export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.missedShots = [];
    this.ships = [];
  }

  receiveAttack(x, y) {}

  placeShip(x, y, z, ship) {}
}

export class GameboardObject {
  constructor(x, y, z, ship) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.ship = ship;
  }
}
