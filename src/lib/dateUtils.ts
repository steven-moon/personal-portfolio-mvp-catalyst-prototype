import { format, parse, isValid, parseISO } from 'date-fns';

/**
 * Formats a date to a consistent human-readable format
 * Handles multiple input formats including ISO strings, Date objects, and formatted strings
 * 
 * @param dateInput Date string in any format or Date object
 * @param formatStr Optional custom format string (default: 'MMMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(dateInput: string | Date | undefined | null, formatStr: string = 'MMMM d, yyyy'): string {
  if (!dateInput) return '';
  
  try {
    // If it's already a Date object
    if (dateInput instanceof Date) {
      return format(dateInput, formatStr);
    }
    
    // If it's an ISO string (contains T)
    if (typeof dateInput === 'string' && dateInput.includes('T')) {
      const date = parseISO(dateInput);
      if (isValid(date)) {
        return format(date, formatStr);
      }
    }
    
    // Try to parse common format 'MMMM d, yyyy'
    if (typeof dateInput === 'string') {
      try {
        const parsedDate = parse(dateInput, 'MMMM d, yyyy', new Date());
        if (isValid(parsedDate)) {
          return format(parsedDate, formatStr);
        }
      } catch (e) {
        // Continue to other formats if this fails
      }
      
      // Try as ISO without time
      try {
        const parsedDate = parseISO(dateInput);
        if (isValid(parsedDate)) {
          return format(parsedDate, formatStr);
        }
      } catch (e) {
        // Continue to other formats if this fails
      }
    }
    
    // Fallback: try to create a date from the input
    const date = new Date(dateInput);
    if (isValid(date)) {
      return format(date, formatStr);
    }
    
    // If all parsing fails, return the original string
    return String(dateInput);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateInput);
  }
}

/**
 * Converts a date to ISO format for API submission
 * 
 * @param dateInput Date string or Date object
 * @returns ISO date string or empty string if invalid
 */
export function toISODate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';
  
  try {
    // If it's already a Date object
    if (dateInput instanceof Date) {
      return dateInput.toISOString();
    }
    
    // If it's already an ISO string
    if (typeof dateInput === 'string' && dateInput.includes('T')) {
      const date = parseISO(dateInput);
      if (isValid(date)) {
        return date.toISOString();
      }
    }
    
    // Try to parse from 'MMMM d, yyyy' format
    if (typeof dateInput === 'string') {
      const parsedDate = parse(dateInput, 'MMMM d, yyyy', new Date());
      if (isValid(parsedDate)) {
        return parsedDate.toISOString();
      }
    }
    
    // Fallback: try to create a date from the input
    const date = new Date(dateInput);
    if (isValid(date)) {
      return date.toISOString();
    }
    
    return '';
  } catch (error) {
    console.error('Error converting to ISO date:', error);
    return '';
  }
} 