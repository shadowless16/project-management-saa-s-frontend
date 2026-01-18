export type UserRole = 'admin' | 'member' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  plan: 'free' | 'pro';
  subscription_status: string;
  paystack_customer_code?: string;
  paystack_subscription_code?: string;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  org_id: string;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  key?: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  assigned_to?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  org_id: string;
  user_id: string;
  action: string;
  created_at: string;
}
