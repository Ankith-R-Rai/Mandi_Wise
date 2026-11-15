/**
 * Utility for combining Tailwind CSS class names cleanly.
 * Handles conditionals, arrays, and filters out falsy values.
 */

export type ClassValue = string | number | boolean | undefined | null;

export function cn(...classes: (ClassValue | ClassValue[])[]): string {
  return classes
    .flat(Infinity as 1)
    .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    .join(' ');
}
