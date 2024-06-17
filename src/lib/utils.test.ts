import { describe, expect, test } from 'bun:test';

import { formatDateToLongString, formatTimeTo12HourString } from './utils';

describe('utils', () => {
  test('dates get converted to long string', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const formattedDate = formatDateToLongString(date);
    expect(formattedDate).toBe('January 1, 2023');
  });

  test('times get converted to 12-hour format', () => {
    const date = new Date('2023-01-01T13:05:00Z');
    const formattedTime = formatTimeTo12HourString(date);
    expect(formattedTime).toBe('1:05 PM');
  });

  test('midnight gets converted to 12:00 AM', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const formattedTime = formatTimeTo12HourString(date);
    expect(formattedTime).toBe('12:00 AM');
  });

  test('noon gets converted to 12:00 PM', () => {
    const date = new Date('2023-01-01T12:00:00Z');
    const formattedTime = formatTimeTo12HourString(date);
    expect(formattedTime).toBe('12:00 PM');
  });

  test('single-digit minute gets leading zero in 12-hour format', () => {
    const date = new Date('2023-01-01T08:09:00Z');
    const formattedTime = formatTimeTo12HourString(date);
    expect(formattedTime).toBe('8:09 AM');
  });
});
