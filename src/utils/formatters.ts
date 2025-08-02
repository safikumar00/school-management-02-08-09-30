import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatters = {
  currency: (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  },

  percentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
  },

  date: (date: string | Date): string => {
    return dayjs(date).format('DD MMM YYYY');
  },

  dateTime: (date: string | Date): string => {
    return dayjs(date).format('DD MMM YYYY, HH:mm');
  },

  timeAgo: (date: string | Date): string => {
    return dayjs(date).fromNow();
  },

  grade: (marks: number, total: number): string => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  },

  attendanceColor: (percentage: number): string => {
    if (percentage >= 85) return '#10B981'; // green
    if (percentage >= 75) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  },

  truncate: (text: string, length: number = 50): string => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  },
};