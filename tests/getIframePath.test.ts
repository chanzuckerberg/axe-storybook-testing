import mockFs from 'mock-fs';
import getIframePath from '../src/getIframePath';

it("raises an error if storybook doesn't exist in buildDir", () => {
  expect(() => getIframePath('.')).toThrow();
});

it('returns the iframe path when the storybook exists', () => {
  mockFs({
    '/tmp-test': {
      'iframe.html': 'file content here',
    },
  });
  try {
    if (process.platform === 'win32') {
      expect(getIframePath('/tmp-test')).toMatch('\\tmp-test\\iframe.html');
    } else {
      expect(getIframePath('/tmp-test')).toBe('/tmp-test/iframe.html');
    }
  } finally {
    mockFs.restore();
  }
});
