import humanizeDuration from '../../../src/formats/humanizeDuration';

test('milliseconds', () => {
  expect(humanizeDuration(1)).toEqual('1ms');
  expect(humanizeDuration(255)).toEqual('255ms');
  expect(humanizeDuration(999)).toEqual('999ms');
});

test('seconds', () => {
  expect(humanizeDuration(1000)).toEqual('1s');
  expect(humanizeDuration(1040)).toEqual('1s');
  expect(humanizeDuration(1400)).toEqual('1.4s');
  expect(humanizeDuration(2000)).toEqual('2s');
  expect(humanizeDuration(59000)).toEqual('59s');
});

test('minutes', () => {
  expect(humanizeDuration(60000)).toEqual('1m');
  expect(humanizeDuration(90500)).toEqual('1.5m');
  expect(humanizeDuration(600000)).toEqual('10m');
  expect(humanizeDuration(1200000)).toEqual('20m');
});
