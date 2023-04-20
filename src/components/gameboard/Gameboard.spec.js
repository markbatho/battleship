/* eslint-disable no-undef */
import Gameboard from './Gameboard';
import Ship from '../ship/Ship';

describe('Gameboard API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Ship placement', () => {
    test('Ship placement on valid coordinates', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      const expected = {
        x: 0,
        y: 1,
        z: 'S',
        ship,
      };

      gameboard.placeShip(0, 1, 'S', ship);

      expect(gameboard.ships).toContainEqual(expected);
    });

    test('Ship placement on invalid coordinates', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      expect(() => gameboard.placeShip(-1, 12, 'N', ship)).toThrow(Error);
      expect(gameboard.ships).toHaveLength(0);
    });

    test('Ship placement on occupied coordinates', () => {
      const gameboard = new Gameboard();

      const ship1 = new Ship(2);
      const ship2 = new Ship(2);

      gameboard.placeShip(1, 2, 'S', ship1);

      expect(() => gameboard.placeShip(1, 2, 'S', ship2)).toThrow(Error);
      expect(gameboard.ships).toHaveLength(1);
    });

    test('Ship cannot be placed (outlapping)', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(5);

      expect(() => gameboard.placeShip(9, 9, 'N', ship)).toThrow(Error);
      expect(gameboard.ships).toHaveLength(0);
    });
  });

  describe('Receiving attacks', () => {
    test('Ship receives an attack', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(5);
      const hitSpy = jest.spyOn(ship, 'hit');
      const isSunkSpy = jest.spyOn(ship, 'isSunk');

      const expected = {
        x: 0,
        y: 1,
        z: 'S',
        ship,
      };

      gameboard.placeShip(0, 1, 'S', ship);
      gameboard.receiveAttack(0, 1);

      expect(gameboard.ships).toContainEqual(expected);
      expect(hitSpy).toHaveBeenCalled();
      expect(isSunkSpy).toHaveBeenCalled();
      expect(isSunkSpy).toHaveReturned(false);
    });

    test('Ship receives multiple attacks', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(5);
      const hitSpy = jest.spyOn(ship, 'hit');
      const isSunkSpy = jest.spyOn(ship, 'isSunk');

      const expected = {
        x: 0,
        y: 1,
        z: 'S',
        ship,
      };

      gameboard.placeShip(0, 1, 'S', ship);

      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(1, 1);

      expect(gameboard.ships).toContainEqual(expected);
      expect(hitSpy).toHaveBeenCalledTimes(2);
      expect(isSunkSpy).toHaveBeenCalledTimes(2);
      expect(isSunkSpy).toHaveNthReturnedWith(0, false);
      expect(isSunkSpy).toHaveNthReturnedWith(1, false);
    });

    test('Ship reveives multiple attacks then sunks', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);
      const hitSpy = jest.spyOn(ship, 'hit');
      const isSunkSpy = jest.spyOn(ship, 'isSunk');

      const expected = {
        x: 0,
        y: 1,
        z: 'S',
        ship,
      };

      gameboard.placeShip(0, 1, 'S', ship);

      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(1, 1);

      expect(gameboard.ships).toContainEqual(expected);
      expect(hitSpy).toHaveBeenCalledTimes(2);
      expect(isSunkSpy).toHaveBeenCalledTimes(2);
      expect(isSunkSpy).toHaveNthReturnedWith(0, false);
      expect(isSunkSpy).toHaveNthReturnedWith(1, true);
    });

    test('Empty coordinate receives attack', () => {
      const gameboard = new Gameboard();

      gameboard.receiveAttack(0, 1);

      expect(gameboard.missedShots).toContain([0, 1]);
    });

    test('Invalid coordinate receives attack', () => {
      const gameboard = new Gameboard();

      expect(() => gameboard.receiveAttack(-1, 12)).toThrow(Error);
      expect(gameboard.missedShots).toHaveLength(0);
    });

    test('Already hit coordinate receives attack', () => {
      const gameboard = new Gameboard();

      gameboard.receiveAttack(0, 1);

      expect(() => gameboard.receiveAttack(0, 1)).toThrow(Error);
      expect(gameboard.missedShots).toContain([0, 1]);
      expect(gameboard.missedShots).toHaveLength(1);
    });
  });
});
