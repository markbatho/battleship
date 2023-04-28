export default class Ship {
  constructor(length, type) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
    this.type = type;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length ? true : false;
  }
}
