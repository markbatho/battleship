/* eslint-disable no-undef */

import Coordinate from '../gameboard/Coordinate';
import Gameboard from '../gameboard/Gameboard';
import Player from './Player';

describe('Player', () => {
  test('Player attacks gameboard', () => {
    const gameboard = new Gameboard();
    const player = new Player(gameboard);
    const spy = jest.spyOn(gameboard, 'receiveAttack');

    player.manualAttack(new Coordinate(2, 4));

    expect(spy).toHaveBeenCalled();
  });

  test('Computer attacks gameboard', () => {
    const gameboard = new Gameboard();
    const player = new Player(gameboard);
    const spy = jest.spyOn(gameboard, 'receiveAttack');

    player.autoAttack();

    expect(spy).toHaveBeenCalled();
  });

  test('Computer hits a ship', () => {
    const gameboard = new Gameboard();
    const player = new Player(gameboard);
    const spy = jest.spyOn(gameboard, 'receiveAttack');

    player.autoAttack();

    expect(spy).toHaveBeenCalled();
  });
});
