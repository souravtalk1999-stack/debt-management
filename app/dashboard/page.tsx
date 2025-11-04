'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { AlertCircle, TrendingDown, TrendingUp, CreditCard, Calendar } from 'lucide-react';

interface DashboardData {
  totalDebt: number;
  totalMonthlyEmi: number;
  totalMonthlyIncome: number;
  dtiRatio: number;
  avgApr: number;
  highestInterestLoan: {
    lenderName: string;
    aprRate: number;
    outstanding: number;
  } | null;
  riskLevel: string;
  riskColor: string;
  totalLoans: number;
  loans: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8">Error loading dashboard data</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your debt situation</p>
      </div>

      {/* Risk Alert */}
      {data.dtiRatio > 50 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Critical Debt Situation</h3>
            <p className="text-sm text-red-700 mt-1">
              Your EMI burden ({formatCurrency(data.totalMonthlyEmi)}) exceeds {Math.round((data.totalMonthlyEmi / data.totalMonthlyIncome) * 100)}% of your monthly income.
              Consider debt consolidation or restructuring urgently.
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Outstanding Debt</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(data.totalDebt)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-600">{data.totalLoans} active loans</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monthly EMI Burden</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(data.totalMonthlyEmi)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Due monthly</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Debt-to-Income Ratio</CardDescription>
            <CardTitle className="text-3xl">{data.dtiRatio}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getRiskBadgeColor(data.riskLevel)}>
              {data.riskLevel.toUpperCase()} RISK
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average APR</CardDescription>
            <CardTitle className="text-3xl">{data.avgApr.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Across all loans</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highest Interest Loan Alert */}
      {data.highestInterestLoan && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Highest Interest Loan - Priority for Payoff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Lender</p>
                <p className="text-lg font-semibold">{data.highestInterestLoan.lenderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">APR</p>
                <p className="text-lg font-semibold text-red-600">{data.highestInterestLoan.aprRate.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-lg font-semibold">{formatCurrency(data.highestInterestLoan.outstanding)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Income vs EMI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Income vs EMI Burden</CardTitle>
            <CardDescription>Monthly cash flow analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Monthly Income</span>
                <span className="text-sm font-semibold">{formatCurrency(data.totalMonthlyIncome)}</span>
              </div>
              <Progress value={100} className="h-3 bg-green-100" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Monthly EMI</span>
                <span className="text-sm font-semibold">{formatCurrency(data.totalMonthlyEmi)}</span>
              </div>
              <Progress
                value={Math.min((data.totalMonthlyEmi / data.totalMonthlyIncome) * 100, 100)}
                className="h-3 bg-red-100"
              />
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Remaining</span>
                <span className={`text-sm font-semibold ${data.totalMonthlyIncome - data.totalMonthlyEmi < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(data.totalMonthlyIncome - data.totalMonthlyEmi)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Loans by Interest Rate</CardTitle>
            <CardDescription>Focus on clearing these first</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.loans.slice(0, 5).map((loan, index) => (
                <div key={loan.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-red-100 text-red-600' :
                      index === 1 ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{loan.lenderName}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(loan.currentOutstanding)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{loan.aprRate.toFixed(2)}%</p>
                    <p className="text-sm text-gray-500">APR</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>Based on your current debt situation</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.dtiRatio > 100 && (
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-red-900">Critical: Apply for debt consolidation loan immediately</p>
                  <p className="text-sm text-gray-600">Your EMI exceeds income. Consolidation can reduce monthly burden.</p>
                </div>
              </li>
            )}
            {data.highestInterestLoan && data.highestInterestLoan.aprRate > 50 && (
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-orange-900">Prioritize clearing {data.highestInterestLoan.lenderName}</p>
                  <p className="text-sm text-gray-600">Predatory {data.highestInterestLoan.aprRate.toFixed(0)}% APR is costing you dearly. Use avalanche method.</p>
                </div>
              </li>
            )}
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Review debt strategy planner</p>
                <p className="text-sm text-gray-600">See how extra payments can save interest and reduce debt faster.</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
