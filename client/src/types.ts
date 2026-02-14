export type Role = 'admin' | 'user';
export type PlanType = 'basic' | 'pro';
export type SubscriptionDuration = 'monthly' | 'quarterly' | '6months' | '1year';
export type AccountStatus = 'active' | 'disabled';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  // New subscription fields
  mobile?: string;
  companyName?: string;
  companyAddress?: string;
  domain?: string;
  numberOfUsers?: number;
  planType?: PlanType;
  subscriptionDuration?: SubscriptionDuration;
  accountStatus?: AccountStatus;
  renewalDate?: string;
}
