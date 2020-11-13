import chalk from 'chalk';
import dedent from 'ts-dedent';
import { createEmitter } from '../../../src/Emitter';
import { Result } from '../../../src/Result';
import { SuiteEvents } from '../../../src/Suite';
import { format } from '../../../src/formats/Spec';

const noColors = new chalk.Instance({ level: 0 });

test('suiteStart', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('suiteStart', 'mosaic');
  expect(print).toHaveBeenCalledWith('[mosaic] accessibility');
});

test('componentStart', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('componentStart', 'button');
  expect(print).toHaveBeenCalledWith('  button');
});

test('componentSkip', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('componentSkip', 'button');
  expect(print).toHaveBeenCalledWith('  [skipped] button');
});

test('storyPass', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  const result: Result = {
    violations: [],
  };

  emitter.emit('storyPass', 'some story', 'some component', result, 666);
  expect(print).toHaveBeenCalledWith('    ✓ some story (666ms)');
});

test('storyFail', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  const result: Result = {
    violations: [],
  };

  emitter.emit('storyFail', 'some story 1', 'some component', result, 666);
  expect(print).toHaveBeenCalledWith('    1) some story 1 (666ms)');

  emitter.emit('storyFail', 'some story 2', 'some component', result, 666);
  expect(print).toHaveBeenCalledWith('    2) some story 2 (666ms)');
});

test('storySkip', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  emitter.emit('storySkip', 'some story', 'some component');
  expect(print).toHaveBeenCalledWith('    - some story');
});

test('suiteFinish', () => {
  const emitter = createEmitter<SuiteEvents>();
  const print = jest.fn();

  format(emitter, print, noColors);
  expect(print).not.toHaveBeenCalled();

  const result: Result = {
    violations: [
      {
        description: 'Ensures buttons have discernible text',
        help: 'Buttons must have discernible text',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.0/button-name',
        id: 'button-name',
        tags: [],
        nodes: [
          {
            html: '<button></button>',
            target: [],
            any: [],
            all: [],
            none: [],
            failureSummary: "Nope, that is not right, because\nIt's not",
          },
        ],
      },
    ],
  };

  emitter.emit('storyFail', 'some story 1', 'some component', result, 666);
  emitter.emit('suiteFinish', 'ie6', 0, 1, 0, 666 );

  expect(print).toHaveBeenCalledWith(dedent`
    0 passing (666ms)
    1 failing
    0 pending
  `);

  expect(print).toHaveBeenCalledWith(dedent`
    1) [ie6] accessibility
         some component
           some story 1

           Detected the following accessibility violations!

           1. button-name (Buttons must have discernible text)

              For more info, visit https://dequeuniversity.com/rules/axe/4.0/button-name.

              Check these nodes:

              - html: <button></button>
                summary: Nope, that is not right, because
                         It's not
  `);
});
