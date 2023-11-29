import { isBefore, parse, format } from "date-fns";

export const today = format(new Date(), "yyyy-MM-dd");

/**
 * Converts a date string in the format "YYYY-MM-DD" to the format "MM/DD/YYYY".
 *
 * @param {string} myDate - The date string to be converted.
 * @return {string} The converted date string in the format "MM/DD/YYYY".
 */
export function convertDate(myDate: string): string {
  const d = parseDate(myDate);
  return format(d, "M/d/yyyy");
}

/**
 * Parses a string representation of a date into a Date object.
 *
 * @param {string} myDate - The string representation of the date.
 * @return {Date} The parsed Date object.
 */
export function parseDate(myDate: string): Date {
  return parse(myDate, "yyyy-MM-dd", new Date());
}

export function isLate(myDate: string): boolean {
  const dueDate = parseDate(myDate);
  return isBefore(dueDate, new Date());
}
