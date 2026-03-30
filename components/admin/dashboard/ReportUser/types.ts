export type ReportStatus = 'Pending' | 'Resolved';
export type ReportReason = 'Fraud' | 'Abuse' | 'Spam' | 'Other';

export type ReportedUserRow = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  reports: number;
  reason: ReportReason;
  latest: string;
  status: ReportStatus;
};