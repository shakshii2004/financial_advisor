import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names using clsx and tailwind-merge.
 * This is the standard utility helper for shadcn/ui and modern Tailwind projects.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a user-friendly error message from an API error response.
 */
export function extractErrorMessage(error: any, defaultMessage = 'An unexpected error occurred'): string {
  if (error?.response?.data?.errors) {
    // If Laravel validation errors exist, get the first one
    const firstErrorKey = Object.keys(error.response.data.errors)[0];
    return error.response.data.errors[firstErrorKey][0];
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
}
