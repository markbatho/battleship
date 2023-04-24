/* eslint-disable no-undef */
import Gameboard from './Gameboard';
import Coordinate from './Coordinate';
import Ship from '../ship/Ship';

describe('Gameboard API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Ship placement', () => {
    test('Ship placement on valid coordinates', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      const expected = {
        coords: [
          { x: 2, y: 4 },
          { x: 2, y: 5 },
          { x: 2, y: 6 },
        ],
        ship,
      };

      gameboard.placeShip(new Coordinate(2, 4), 'N', ship);

      expect(gameboard.ships).toContainEqual(expected);
    });

    test('Ship placement on invalid coordinates', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      expect(() =>
        gameboard.placeShip(new Coordinate(-1, 12), 'N', ship)
      ).toThrow(Error);
      expect(gameboard.ships).toHaveLength(0);
    });

    test('Ship placement on occupied coordinates', () => {
      const gameboard = new Gameboard();
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);

      gameboard.placeShip(new Coordinate(2, 4), 'N', ship1);

      expect(() =>
        gameboard.placeShip(new Coordinate(2, 4), 'N', ship2)
      ).toThrow(Error);
      expect(gameboard.ships).toHaveLength(1);
    });
  });

  describe('Receiving attacks', () => {
    test('Ship receives an attack', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      const shot = new Coordinate(2, 5);
      const hitSpy = jest.spyOn(ship, 'hit');
      const isSunkSpy = jest.spyOn(ship, 'isSunk');

      gameboard.placeShip(new Coordinate(2, 4), 'N', ship);
      const attack = gameboard.receiveAttack(shot);

      expect(hitSpy).toHaveBeenCalled();
      expect(isSunkSpy).toHaveReturnedWith(false);
      expect(attack).toBe(true);
      expect(gameboard.shots).toContainEqual(shot);
    });

    test('Ship sunks', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      const shot1 = new Coordinate(2, 4);
      const shot2 = new Coordinate(2, 5);
      const shot3 = new Coordinate(2, 6);
      const hitSpy = jest.spyOn(ship, 'hit');
      const isSunkSpy = jest.spyOn(ship, 'isSunk');

      gameboard.placeShip(new Coordinate(2, 4), 'N', ship);
      gameboard.receiveAttack(shot1);
      gameboard.receiveAttack(shot2);
      gameboard.receiveAttack(shot3);

      expect(hitSpy).toHaveBeenCalledTimes(3);
      expect(isSunkSpy).toHaveBeenCalledTimes(3);
      expect(isSunkSpy).toHaveLastReturnedWith(true);
    });

    test('Empty coordinate receives attack', () => {
      const gameboard = new Gameboard();
      const shot = new Coordinate(2, 4);

      const attack = gameboard.receiveAttack(shot);

      expect(attack).toBe(false);
      expect(gameboard.missedShots).toContainEqual(shot);
    });

    test('Invalid coordinate receives attack', () => {
      const gameboard = new Gameboard();
      const shot = new Coordinate(-1, 12);

      expect(() => gameboard.receiveAttack(shot)).toThrow(Error);
      expect(gameboard.missedShots).toHaveLength(0);
    });

    test('Already hit coordinate receives attack', () => {
      const gameboard = new Gameboard();
      const shot1 = new Coordinate(2, 4);
      const shot2 = new Coordinate(2, 4);

      gameboard.receiveAttack(shot1);

      expect(() => gameboard.receiveAttack(shot2)).toThrow(Error);
      expect(gameboard.missedShots).toHaveLength(1);
    });
  });
});
