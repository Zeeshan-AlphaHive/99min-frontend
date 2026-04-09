export type TaskStatus = 'Active' | 'Pending' | 'Expired' | 'Removed';  // ← added 'Removed'

export type TaskRow = {
  id: string;           // ← number → string (MongoDB _id)
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