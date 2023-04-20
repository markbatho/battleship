/* eslint-disable no-undef */
import Ship from './Ship';

const ship = new Ship(5);

let hitSpy;

describe('Ship API', () => {
  beforeEach(() => {
    hitSpy = jest.spyOn(ship, 'hit');
  });

  afterEach(() => {
    ship.hits = 0;
    jest.restoreAllMocks();
  });

  test('Hit ship once', () => {
    ship.hit();

    expect(hitSpy).toHaveBeenCalled();
    expect(ship.hits).toBe(1);
  });

  test('Hit ship multiple times', () => {
    ship.hit();
    ship.hit();
    ship.hit();

    expect(hitSpy).toHaveBeenCalledTimes(3);
    expect(ship.hits).toBe(3);
  });

  test('Sunk the ship', () => {
    for (ship.length; ship.hits < ship.length; ) {
      ship.hit();
    }

    expect(hitSpy).toHaveBeenCalledTimes(ship.length);
    expect(ship.isSunk()).toBe(true);
  });
});
