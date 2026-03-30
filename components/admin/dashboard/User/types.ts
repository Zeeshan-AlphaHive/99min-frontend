export type UserPlan = 'Pro' | 'Business' | 'Free';
export type UserStatus = 'Active' | 'Suspended';

export type UserManagementRow = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  plan: UserPlan;
  tasksPosted: number;
  status: UserStatus;
  joinDate: string;
};