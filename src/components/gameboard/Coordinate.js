export default class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  isEqual(coord) {
    if (this.x === coord.x && this.y === coord.y) return true;
    return false;
  }
}
