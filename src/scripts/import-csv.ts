import { db, users, loans, incomeSources, budgetGoals, debtStrategies } from '../db';
import { generateId } from '../lib/utils';

// Create default user (Sourav)
const userId = generateId();

console.log('Starting data import...');

// Insert user
db.insert(users).values({
  id: userId,
  name: 'Sourav De',
  email: 'sourav@example.com',
  passwordHash: 'hashed_password', // In production, use proper hashing
  monthlySalary: 90000,
}).run();

console.log('✅ User created');

// Insert loans from CSV
const loansData = [
  {
    id: generateId(),
    userId,
    lenderName: 'Sayyam',
    loanType: 'personal',
    principalAmount: 59000,
    currentOutstanding: 59000,
    aprRate: 165.96,
    interestRateMonthly: 13.83,
    emiAmount: 71733,
    emiDueDate: 2, // Jan 2nd
    startDate: '2025-11-01',
    endDate: '2026-01-03',
    tenureMonths: 2,
    remainingMonths: 2,
    loanStatus: 'active',
    priorityRank: 1,
    notes: 'HIGHEST PRIORITY - Predatory rate',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'Vivriti',
    loanType: 'personal',
    principalAmount: 106639,
    currentOutstanding: 106639,
    aprRate: 59.31,
    interestRateMonthly: 4.94,
    emiAmount: 10687,
    emiDueDate: 20,
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    tenureMonths: 12,
    remainingMonths: 12,
    loanStatus: 'active',
    priorityRank: 2,
    notes: 'Second highest rate',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'Chinmay',
    loanType: 'personal',
    principalAmount: 108000,
    currentOutstanding: 108000,
    aprRate: 46.16,
    interestRateMonthly: 3.85,
    emiAmount: 20739,
    emiDueDate: 28,
    startDate: '2025-05-01',
    endDate: '2025-11-01',
    tenureMonths: 6,
    remainingMonths: 6,
    loanStatus: 'active',
    priorityRank: 3,
    notes: 'Third highest rate',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'EarlySalary',
    loanType: 'personal',
    principalAmount: 100000,
    currentOutstanding: 100000,
    aprRate: 45.69,
    interestRateMonthly: 3.81,
    emiAmount: 18155,
    emiDueDate: 6,
    startDate: '2025-05-01',
    endDate: '2025-11-01',
    tenureMonths: 6,
    remainingMonths: 6,
    loanStatus: 'active',
    priorityRank: 4,
    notes: 'Fourth highest rate',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'Amica/KSF',
    loanType: 'personal',
    principalAmount: 110000,
    currentOutstanding: 110000,
    aprRate: 31.13,
    interestRateMonthly: 2.59,
    emiAmount: 10295,
    emiDueDate: 5,
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    tenureMonths: 12,
    remainingMonths: 12,
    loanStatus: 'active',
    priorityRank: 6,
    notes: 'Manageable rate',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'KrazyBee',
    loanType: 'personal',
    principalAmount: 155688,
    currentOutstanding: 155688,
    aprRate: 25.47,
    interestRateMonthly: 2.12,
    emiAmount: 11410,
    emiDueDate: 5,
    startDate: '2025-01-01',
    endDate: '2026-05-01',
    tenureMonths: 16,
    remainingMonths: 16,
    loanStatus: 'active',
    priorityRank: 7,
    notes: 'Lowest rate - pay normally',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'Zype',
    loanType: 'personal',
    principalAmount: 19000,
    currentOutstanding: 19000,
    aprRate: 36.0, // Estimated
    interestRateMonthly: 3.0,
    emiAmount: 0, // Unknown
    emiDueDate: 15,
    startDate: '2025-08-01',
    endDate: null,
    tenureMonths: 12,
    remainingMonths: 12,
    loanStatus: 'active',
    priorityRank: 5,
    notes: 'NEED DETAILS - APR, EMI, Due date',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'FlexSalary',
    loanType: 'personal',
    principalAmount: 23000,
    currentOutstanding: 23000,
    aprRate: 36.0, // Estimated
    interestRateMonthly: 3.0,
    emiAmount: 2500,
    emiDueDate: 10,
    startDate: '2025-06-01',
    endDate: null,
    tenureMonths: 10,
    remainingMonths: 10,
    loanStatus: 'active',
    priorityRank: 5,
    notes: 'NEED DETAILS - Exact APR, Due date',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'Other Loan',
    loanType: 'personal',
    principalAmount: 100000,
    currentOutstanding: 100000,
    aprRate: 36.0, // Estimated
    interestRateMonthly: 3.0,
    emiAmount: 0, // Unknown
    emiDueDate: 15,
    startDate: '2025-07-01',
    endDate: null,
    tenureMonths: 12,
    remainingMonths: 12,
    loanStatus: 'active',
    priorityRank: 5,
    notes: 'NEED DETAILS - CRITICAL - WHO IS THIS? APR? EMI?',
  },
  {
    id: generateId(),
    userId,
    lenderName: 'Credit Cards',
    loanType: 'credit_card',
    principalAmount: 300000,
    currentOutstanding: 300000,
    aprRate: 39.0, // Average 36-42%
    interestRateMonthly: 3.25,
    emiAmount: 15000, // Minimum payment
    emiDueDate: 10,
    startDate: '2024-01-01',
    endDate: null,
    tenureMonths: 999, // Revolving
    remainingMonths: 999,
    loanStatus: 'active',
    priorityRank: 5,
    notes: 'NEED CARD-WISE BREAKDOWN',
  },
];

for (const loan of loansData) {
  db.insert(loans).values(loan).run();
}

console.log(`✅ Inserted ${loansData.length} loans`);

// Insert income sources
const incomeData = [
  {
    id: generateId(),
    userId,
    sourceName: 'Verterim Salary',
    sourceType: 'recurring',
    amount: 90000,
    frequency: 'monthly',
    isGuaranteed: true,
    startDate: '2024-01-01',
    endDate: null,
    notes: 'Main salary - guaranteed',
  },
  {
    id: generateId(),
    userId,
    sourceName: 'Proinception Freelancing',
    sourceType: 'recurring',
    amount: 90000,
    frequency: 'monthly',
    isGuaranteed: true,
    startDate: '2025-11-01',
    endDate: '2026-01-31',
    notes: 'ONLY Nov/Dec/Jan 2025 then STOPS',
  },
  {
    id: generateId(),
    userId,
    sourceName: 'Upwork Freelancing',
    sourceType: 'variable',
    amount: 30000,
    frequency: 'monthly',
    isGuaranteed: false,
    startDate: '2024-01-01',
    endDate: null,
    notes: 'NOT GUARANTEED - highly variable (0-100K)',
  },
];

for (const income of incomeData) {
  db.insert(incomeSources).values(income).run();
}

console.log(`✅ Inserted ${incomeData.length} income sources`);

// Insert budget goals for November 2025
const budgetData = [
  {
    id: generateId(),
    userId,
    category: 'Rent',
    monthlyLimit: 15000,
    currentSpent: 0,
    monthYear: '2025-11',
  },
  {
    id: generateId(),
    userId,
    category: 'Food',
    monthlyLimit: 8000,
    currentSpent: 0,
    monthYear: '2025-11',
  },
  {
    id: generateId(),
    userId,
    category: 'Transport',
    monthlyLimit: 2000,
    currentSpent: 0,
    monthYear: '2025-11',
  },
  {
    id: generateId(),
    userId,
    category: 'Phone/Internet',
    monthlyLimit: 1000,
    currentSpent: 0,
    monthYear: '2025-11',
  },
  {
    id: generateId(),
    userId,
    category: 'Utilities',
    monthlyLimit: 2000,
    currentSpent: 0,
    monthYear: '2025-11',
  },
  {
    id: generateId(),
    userId,
    category: 'Emergency Buffer',
    monthlyLimit: 2000,
    currentSpent: 0,
    monthYear: '2025-11',
  },
];

for (const budget of budgetData) {
  db.insert(budgetGoals).values(budget).run();
}

console.log(`✅ Inserted ${budgetData.length} budget categories`);

// Insert debt avalanche strategy
db.insert(debtStrategies).values({
  id: generateId(),
  userId,
  strategyName: 'avalanche',
  isActive: true,
  priorityOrder: JSON.stringify(['Sayyam', 'Vivriti', 'Chinmay', 'EarlySalary', 'Credit Cards', 'Amica/KSF', 'KrazyBee']),
  extraPaymentAmount: 25000,
}).run();

console.log('✅ Inserted debt avalanche strategy');

console.log('\n🎉 All data imported successfully!');
console.log(`\nSummary:`);
console.log(`- User: Sourav De`);
console.log(`- Loans: ${loansData.length}`);
console.log(`- Income Sources: ${incomeData.length}`);
console.log(`- Budget Categories: ${budgetData.length}`);
console.log(`- Total Debt: ₹${loansData.reduce((sum, l) => sum + l.currentOutstanding, 0).toLocaleString('en-IN')}`);
console.log(`- Monthly EMI: ₹${loansData.reduce((sum, l) => sum + l.emiAmount, 0).toLocaleString('en-IN')}`);
