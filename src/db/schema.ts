import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table (for multi-user support)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  monthlySalary: real('monthly_salary').notNull().default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Loans table
export const loans = sqliteTable('loans', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  lenderName: text('lender_name').notNull(),
  loanType: text('loan_type').notNull(), // personal, credit_card, payday, etc.
  principalAmount: real('principal_amount').notNull(),
  currentOutstanding: real('current_outstanding').notNull(),
  aprRate: real('apr_rate').notNull(),
  interestRateMonthly: real('interest_rate_monthly'),
  emiAmount: real('emi_amount').notNull(),
  emiDueDate: integer('emi_due_date').notNull(), // day of month (1-31)
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  tenureMonths: integer('tenure_months').notNull(),
  remainingMonths: integer('remaining_months'),
  loanStatus: text('loan_status').default('active'), // active, paid, defaulted, restructured
  priorityRank: integer('priority_rank'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Payments table
export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  loanId: text('loan_id').notNull().references(() => loans.id),
  paymentDate: text('payment_date').notNull(),
  paymentAmount: real('payment_amount').notNull(),
  principalPaid: real('principal_paid').notNull(),
  interestPaid: real('interest_paid').notNull(),
  penaltyPaid: real('penalty_paid').default(0),
  paymentMethod: text('payment_method'), // bank_transfer, upi, cash, etc.
  paymentStatus: text('payment_status').default('completed'), // completed, pending, failed
  transactionId: text('transaction_id'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Income sources table
export const incomeSources = sqliteTable('income_sources', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  sourceName: text('source_name').notNull(),
  sourceType: text('source_type').notNull(), // recurring, one_time, variable
  amount: real('amount').notNull(),
  frequency: text('frequency').notNull(), // monthly, weekly, one_time
  isGuaranteed: integer('is_guaranteed', { mode: 'boolean' }).default(false),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Expenses table
export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  category: text('category').notNull(),
  amount: real('amount').notNull(),
  expenseDate: text('expense_date').notNull(),
  isRecurring: integer('is_recurring', { mode: 'boolean' }).default(false),
  frequency: text('frequency'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Reminders table
export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey(),
  loanId: text('loan_id').notNull().references(() => loans.id),
  reminderType: text('reminder_type').notNull(), // emi_due, payment_overdue, milestone
  reminderDate: text('reminder_date').notNull(),
  daysBefore: integer('days_before').default(3),
  isSent: integer('is_sent', { mode: 'boolean' }).default(false),
  sentAt: text('sent_at'),
  notificationMethod: text('notification_method'), // email, sms, push, in_app
  message: text('message'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Debt milestones table
export const debtMilestones = sqliteTable('debt_milestones', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  milestoneType: text('milestone_type').notNull(), // loan_cleared, total_debt_reduced, etc.
  milestoneDate: text('milestone_date').notNull(),
  description: text('description').notNull(),
  amountInvolved: real('amount_involved'),
  celebrationMessage: text('celebration_message'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Budget goals table
export const budgetGoals = sqliteTable('budget_goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  category: text('category').notNull(),
  monthlyLimit: real('monthly_limit').notNull(),
  currentSpent: real('current_spent').default(0),
  monthYear: text('month_year').notNull(), // '2025-11'
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Savings goals table
export const savingsGoals = sqliteTable('savings_goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  goalName: text('goal_name').notNull(),
  targetAmount: real('target_amount').notNull(),
  currentAmount: real('current_amount').default(0),
  targetDate: text('target_date'),
  priority: integer('priority').default(1),
  isAchieved: integer('is_achieved', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Payment schedules table
export const paymentSchedules = sqliteTable('payment_schedules', {
  id: text('id').primaryKey(),
  loanId: text('loan_id').notNull().references(() => loans.id),
  dueDate: text('due_date').notNull(),
  emiNumber: integer('emi_number').notNull(),
  principalDue: real('principal_due').notNull(),
  interestDue: real('interest_due').notNull(),
  totalEmi: real('total_emi').notNull(),
  paymentStatus: text('payment_status').default('pending'), // pending, paid, overdue, partial
  paidAmount: real('paid_amount').default(0),
  paidDate: text('paid_date'),
  principalOutstanding: real('principal_outstanding').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Debt strategies table
export const debtStrategies = sqliteTable('debt_strategies', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  strategyName: text('strategy_name').notNull(), // avalanche, snowball, hybrid
  isActive: integer('is_active', { mode: 'boolean' }).default(false),
  priorityOrder: text('priority_order'), // JSON array of loan IDs
  extraPaymentAmount: real('extra_payment_amount').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
