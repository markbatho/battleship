/* eslint-disable no-undef */
import Ship from './Ship';

describe('Ship API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Hit ship once', () => {
    const ship = new Ship(5);
    const hitSpy = jest.spyOn(ship, 'hit');

    ship.hit();

    expect(hitSpy).toHaveBeenCalled();
    expect(ship.hits).toBe(1);
  });

  test('Hit ship multiple times', () => {
    const ship = new Ship(5);
    const hitSpy = jest.spyOn(ship, 'hit');

    ship.hit();
    ship.hit();
    ship.hit();

    expect(hitSpy).toHaveBeenCalledTimes(3);
    expect(ship.hits).toBe(3);
  });

  test('Sunk the ship', () => {
    const ship = new Ship(5);
    const hitSpy = jest.spyOn(ship, 'hit');

    for (ship.length; ship.hits < ship.length; ) {
      ship.hit();
    }

    expect(hitSpy).toHaveBeenCalledTimes(ship.length);
    expect(ship.isSunk()).toBe(true);
  });
});
