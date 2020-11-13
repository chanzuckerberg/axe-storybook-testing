import round from 'lodash/round';

/**
 * Convert milliseconds into a human-readable string.
 *
 * @example
 *
 * humanizeDuration(666);
 *
 * // => '666ms'
 *
 * @example
 *
 * humanizeDuration(6666)
 *
 * // => '6.7s'
 */
export default function humanizeDuration(milliseconds: number): string {
  // Milliseconds
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  // Seconds
  if (milliseconds < 60000) {
    const seconds = round(milliseconds / 1000, 1);
    return `${seconds}s`;
  }

  // Minutes
  const minutes = round(milliseconds / 60000, 1);
  return `${minutes}m`;
}
