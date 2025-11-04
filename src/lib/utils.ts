import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function calculateMonthlyInterestRate(apr: number): number {
  return apr / 12 / 100;
}

export function calculateEMI(principal: number, apr: number, tenureMonths: number): number {
  const monthlyRate = calculateMonthlyInterestRate(apr);
  if (monthlyRate === 0) return principal / tenureMonths;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
               (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

export function calculateTotalInterest(emi: number, tenureMonths: number, principal: number): number {
  return (emi * tenureMonths) - principal;
}

export function generatePaymentSchedule(
  principal: number,
  apr: number,
  tenureMonths: number,
  emiAmount: number,
  startDate: Date
) {
  const monthlyRate = calculateMonthlyInterestRate(apr);
  const schedule = [];
  let outstanding = principal;

  for (let i = 1; i <= tenureMonths; i++) {
    const interestDue = outstanding * monthlyRate;
    const principalDue = emiAmount - interestDue;
    outstanding -= principalDue;

    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      emiNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      principalDue: Math.round(principalDue),
      interestDue: Math.round(interestDue),
      totalEmi: emiAmount,
      principalOutstanding: Math.max(0, Math.round(outstanding)),
    });
  }

  return schedule;
}

export function calculateDebtToIncomeRatio(totalEmi: number, monthlyIncome: number): number {
  if (monthlyIncome === 0) return 0;
  return Math.round((totalEmi / monthlyIncome) * 100);
}

export function getRiskLevel(dtiRatio: number): { level: string; color: string; description: string } {
  if (dtiRatio < 36) {
    return {
      level: 'Low',
      color: 'text-green-600',
      description: 'Healthy debt level',
    };
  } else if (dtiRatio < 43) {
    return {
      level: 'Moderate',
      color: 'text-yellow-600',
      description: 'Manageable but watch closely',
    };
  } else if (dtiRatio < 50) {
    return {
      level: 'High',
      color: 'text-orange-600',
      description: 'Critical - reduce debt urgently',
    };
  } else {
    return {
      level: 'Critical',
      color: 'text-red-600',
      description: 'Unsustainable - seek help immediately',
    };
  }
}
