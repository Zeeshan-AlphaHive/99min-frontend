export type AdminRole = 'super_admin' | 'admin' | 'support';

export type RoleCard = {
  id: number;
  title: string;
  activeCount: number;
  description: string;
};

export type AdminRow = {
  id: number;
  avatar: string;
  address: string;
  email: string;
  roleLabel: string;
  lastLogin: string;
};
