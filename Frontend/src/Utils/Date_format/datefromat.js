import { format, formatDistanceToNow } from 'date-fns';

export function fDateTime(date) {
    return format(new Date(date), 'dd MMM yyyy HH:mm:ss');
  }