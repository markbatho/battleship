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
      const ship = new Ship(2);
      const expected = {
        coords: [{x: 2, y: 4}, {x: 2, y: 5}, {x: 2, y: 6}],
        ship
      };

      gameboard.placeShip(new Coordinate(2, 4), 'N', ship);

      expect(gameboard.ships).toContainEqual(expected);
    });

    test('Ship placement on invalid coordinates', () => {
      const gameboard = new Gameboard();
      const ship = new Ship(2);

      expect(() =>  gameboard.placeShip(new Coordinate(-1, 12), 'N', ship)).toThrow(Error);
      expect(gameboard.ships).toHaveLength(0);
    });

    test('Ship placement on occupied coordinates', () => {
      const gameboard = new Gameboard();
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);

      gameboard.placeShip(new Coordinate(2, 4), 'N', ship1);
      
      expect(() => gameboard.placeShip(new Coordinate(2, 4), 'N', ship2)).toThrow(Error);
      expect(gameboard.ships).toHaveLength(1);
    });
  });

  describe('Receiving attacks', () => {
    test('Ship receives an attack', () => {
    });

    test('Ship receives multiple attacks', () => {
    });

    test('Ship reveives multiple attacks then sunks', () => {
    });

    test('Empty coordinate receives attack', () => {
    });

    test('Invalid coordinate receives attack', () => {
    });

    test('Already hit coordinate receives attack', () => {
    });
  });
});
