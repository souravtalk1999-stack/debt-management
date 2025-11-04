import { NextResponse } from 'next/server';
import { db, loans, incomeSources } from '@/src/db';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all active loans
    const allLoans = db.select().from(loans).where(eq(loans.loanStatus, 'active')).all();

    // Get all guaranteed income sources
    const income = db.select().from(incomeSources).where(eq(incomeSources.isGuaranteed, true)).all();

    // Calculate total outstanding debt
    const totalDebt = allLoans.reduce((sum, loan) => sum + loan.currentOutstanding, 0);

    // Calculate total monthly EMI
    const totalMonthlyEmi = allLoans.reduce((sum, loan) => sum + loan.emiAmount, 0);

    // Calculate total monthly income
    const totalMonthlyIncome = income.reduce((sum, inc) => {
      if (inc.frequency === 'monthly') return sum + inc.amount;
      return sum;
    }, 0);

    // Calculate debt-to-income ratio
    const dtiRatio = totalMonthlyIncome > 0 ? Math.round((totalMonthlyEmi / totalMonthlyIncome) * 100) : 0;

    // Calculate average APR
    const avgApr = allLoans.length > 0
      ? allLoans.reduce((sum, loan) => sum + loan.aprRate, 0) / allLoans.length
      : 0;

    // Find highest interest loan
    const highestInterestLoan = allLoans.reduce((max, loan) =>
      loan.aprRate > (max?.aprRate || 0) ? loan : max
    , allLoans[0]);

    // Get risk level
    let riskLevel = 'low';
    let riskColor = 'green';
    if (dtiRatio > 100) {
      riskLevel = 'critical';
      riskColor = 'red';
    } else if (dtiRatio > 50) {
      riskLevel = 'high';
      riskColor = 'orange';
    } else if (dtiRatio > 36) {
      riskLevel = 'moderate';
      riskColor = 'yellow';
    }

    return NextResponse.json({
      totalDebt,
      totalMonthlyEmi,
      totalMonthlyIncome,
      dtiRatio,
      avgApr: Math.round(avgApr * 100) / 100,
      highestInterestLoan: highestInterestLoan ? {
        lenderName: highestInterestLoan.lenderName,
        aprRate: highestInterestLoan.aprRate,
        outstanding: highestInterestLoan.currentOutstanding,
      } : null,
      riskLevel,
      riskColor,
      totalLoans: allLoans.length,
      loans: allLoans.sort((a, b) => b.aprRate - a.aprRate).slice(0, 5), // Top 5 by APR
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
