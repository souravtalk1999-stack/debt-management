'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';

interface Loan {
  id: string;
  lenderName: string;
  loanType: string;
  principalAmount: number;
  currentOutstanding: number;
  aprRate: number;
  emiAmount: number;
  emiDueDate: number;
  remainingMonths: number | null;
  loanStatus: string;
  priorityRank: number | null;
  notes: string | null;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/loans')
      .then(res => res.json())
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-gray-100 text-gray-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityBadge = (rank: number | null) => {
    if (!rank) return null;
    if (rank === 1) return 'bg-red-100 text-red-800 border-red-300';
    if (rank <= 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Sort loans by priority rank and APR
  const sortedLoans = [...loans].sort((a, b) => {
    if (a.priorityRank && b.priorityRank) return a.priorityRank - b.priorityRank;
    if (a.priorityRank) return -1;
    if (b.priorityRank) return 1;
    return b.aprRate - a.aprRate;
  });

  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.currentOutstanding, 0);
  const totalEMI = loans.reduce((sum, loan) => sum + loan.emiAmount, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
        <p className="text-gray-500 mt-1">Manage all your debts in one place</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Outstanding</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalOutstanding)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monthly EMI</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalEMI)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Loans</CardDescription>
            <CardTitle className="text-2xl">{loans.filter(l => l.loanStatus === 'active').length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        {sortedLoans.map((loan) => (
          <Card key={loan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle>{loan.lenderName}</CardTitle>
                    {loan.priorityRank && (
                      <Badge className={getPriorityBadge(loan.priorityRank)}>
                        Priority #{loan.priorityRank}
                      </Badge>
                    )}
                    <Badge className={getStatusBadge(loan.loanStatus)}>
                      {loan.loanStatus}
                    </Badge>
                  </div>
                  {loan.notes && (
                    <CardDescription className="mt-1">{loan.notes}</CardDescription>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{loan.aprRate.toFixed(2)}%</p>
                  <p className="text-sm text-gray-500">APR</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Outstanding</p>
                  <p className="text-lg font-semibold">{formatCurrency(loan.currentOutstanding)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly EMI</p>
                  <p className="text-lg font-semibold">{formatCurrency(loan.emiAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-lg font-semibold">{loan.emiDueDate}{getOrdinalSuffix(loan.emiDueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining Months</p>
                  <p className="text-lg font-semibold">{loan.remainingMonths || 'N/A'}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((loan.principalAmount - loan.currentOutstanding) / loan.principalAmount) * 100)}% paid</span>
                </div>
                <Progress
                  value={((loan.principalAmount - loan.currentOutstanding) / loan.principalAmount) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
