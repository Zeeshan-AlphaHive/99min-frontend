export type UserPlan = 'Pro' | 'Business' | 'Free';
export type UserStatus = 'Active' | 'Suspended' | 'Removed';  // ← added 'Removed'

export type UserManagementRow = {
  id: string;           // ← number → string (MongoDB _id)
  avatar: string;
  name: string;
  email: string;
  plan: UserPlan;
  tasksPosted: number;
  status: UserStatus;
  joinDate: string;
};