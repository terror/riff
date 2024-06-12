import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges and returns a string of conditional class names,
 * combining Tailwind CSS classes using `twMerge` and conditional classes using `clsx`.
 *
 * @param {...ClassValue[]} inputs - The class names to be conditionally merged.
 * @returns {string} The merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/**
 * Formats a given date into a string with the format "Month Day, Year".
 * Example: "January 1, 2023"
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string.
 */
export const formatDateToLongString = (date: Date): string =>
  `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;

/**
 * Formats a given date into a string with the format "HH:MM AM/PM".
 * Example: "1:05 PM"
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted time string.
 */
export const formatTimeTo12HourString = (date: Date): string => {
  let hours = date.getHours();

  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes < 10 ? '0' + minutes : minutes.toString()} ${ampm}`;
};
