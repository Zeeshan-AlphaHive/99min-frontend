export type TaskStatus = 'Active' | 'Pending' | 'Expired';

export type TaskRow = {
  id: number;
  avatar: string;
  title: string;
  description: string;
  budget: string;
  location: string;
  remaining: string;
  remainingExpired?: boolean;
  interested: number;
  status: TaskStatus;
};