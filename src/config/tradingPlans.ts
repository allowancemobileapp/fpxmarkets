
import type { AccountType } from '@/lib/types';

export interface TradingPlan {
  id: number; // Added ID to match database schema for trading_plans table
  value: AccountType; // This is the string name like 'Beginner'
  label: string;
  minimumDeposit: number;
  description: string;
}

export const tradingPlans: TradingPlan[] = [
  {
    id: 1, // Ensure these IDs match your database `trading_plans.id`
    value: 'Beginner',
    label: 'Beginner',
    minimumDeposit: 500,
    description: 'Perfect for getting started with essential trading tools and support.',
  },
  {
    id: 2,
    value: 'Personal',
    label: 'Personal',
    minimumDeposit: 2500,
    description: 'Ideal for individual traders looking for enhanced features and lower fees.',
  },
  {
    id: 3,
    value: 'Pro',
    label: 'Pro',
    minimumDeposit: 10000,
    description: 'For serious traders requiring advanced tools, priority support, and best conditions.',
  },
  {
    id: 4,
    value: 'Professional',
    label: 'Professional',
    minimumDeposit: 50000,
    description: 'Tailored for high-volume professional traders with bespoke services.',
  },
  {
    id: 5,
    value: 'Corporate',
    label: 'Corporate',
    minimumDeposit: 100000,
    description: 'Comprehensive solutions for institutional and corporate clients.',
  },
];

export const getTradingPlan = (accountType?: AccountType): TradingPlan | undefined => {
  if (!accountType) return undefined;
  return tradingPlans.find(plan => plan.value === accountType);
};

export const getTradingPlanById = (id?: number): TradingPlan | undefined => {
  if (id === undefined || id === null) return undefined;
  return tradingPlans.find(plan => plan.id === id);
};
