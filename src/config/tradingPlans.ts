
import type { AccountType } from '@/lib/types';

export interface TradingPlan {
  value: AccountType;
  label: string;
  minimumDeposit: number;
  description: string;
}

export const tradingPlans: TradingPlan[] = [
  {
    value: 'Beginner',
    label: 'Beginner',
    minimumDeposit: 500,
    description: 'Perfect for getting started with essential trading tools and support.',
  },
  {
    value: 'Personal',
    label: 'Personal',
    minimumDeposit: 2500,
    description: 'Ideal for individual traders looking for enhanced features and lower fees.',
  },
  {
    value: 'Pro',
    label: 'Pro',
    minimumDeposit: 10000,
    description: 'For serious traders requiring advanced tools, priority support, and best conditions.',
  },
  {
    value: 'Professional',
    label: 'Professional',
    minimumDeposit: 50000,
    description: 'Tailored for high-volume professional traders with bespoke services.',
  },
  {
    value: 'Corporate',
    label: 'Corporate',
    minimumDeposit: 100000,
    description: 'Comprehensive solutions for institutional and corporate clients.',
  },
];

export const getTradingPlan = (accountType?: AccountType): TradingPlan | undefined => {
  return tradingPlans.find(plan => plan.value === accountType);
};
