import { format } from 'date-fns';

export function fDateTime(date) {
  return format(new Date(date), 'dd MMMM yyyy');;
  }

  export function fDateTimesec(date) {
    return format(new Date(date), 'dd MMM yyyy HH:mm:ss');
  }