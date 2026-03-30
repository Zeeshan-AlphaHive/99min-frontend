export type SubPlan = 'Pro' | 'Business' | 'Free';
export type SubStatus = 'Active' | 'Expired';

export type SubscriptionRow = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  plan: SubPlan;
  startDate: string;
  status: SubStatus;
  expiryDate: string;
  daysRemaining: number;
};