// utils/dateUtils.js

// Import the necessary module for formatting dates
import { format } from 'date-fns';

// Available format options
const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM dd, yyyy',
  TIME: 'hh:mm a',
  FULL: 'MMMM dd, yyyy hh:mm a',
};

export const formatDate = (date, formatType = 'SHORT') => {
  if (!date) return null;

  const dateObject = new Date(date);
  
  // Choose the format based on the formatType
  const formatString = DATE_FORMATS[formatType.toUpperCase()] || formatType;

  // Return the formatted date
  return format(dateObject, formatString);
};

// Examples of usage
//const shortDate = formatDate('2024-08-13'); // Default: SHORT format
//const longDate = formatDate('2024-08-13', 'LONG');
//const timeOnly = formatDate('2024-08-13T14:30:00', 'TIME');
//const fullDateTime = formatDate('2024-08-13T14:30:00', 'FULL');
//const customDate = formatDate('2024-08-13T14:30:00', 'yyyy-MM-dd HH:mm:ss');

//console.log(shortDate); // Output: 08/13/2024
//console.log(longDate);  // Output: August 13, 2024
//console.log(timeOnly);  // Output: 02:30 PM
//console.log(fullDateTime); // Output: August 13, 2024 02:30 PM
//console.log(customDate); // Output: 2024-08-13 14:30:00