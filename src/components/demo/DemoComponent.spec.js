/* eslint-disable no-undef */
import DemoComponent from './DemoComponent';

const demoComponent = new DemoComponent();

test('demoFn should return the expected value', () => {
  expect(demoComponent.demoFn()).toBe('Hello, World!');
});
