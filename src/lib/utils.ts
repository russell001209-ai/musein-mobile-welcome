import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Only the styling helper is needed; no production service configuration.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
