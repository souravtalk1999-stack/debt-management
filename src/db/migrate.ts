import Database from 'better-sqlite3';

const db = new Database('debt-management.db');

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  monthly_salary REAL NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  lender_name TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  principal_amount REAL NOT NULL,
  current_outstanding REAL NOT NULL,
  apr_rate REAL NOT NULL,
  interest_rate_monthly REAL,
  emi_amount REAL NOT NULL,
  emi_due_date INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  tenure_months INTEGER NOT NULL,
  remaining_months INTEGER,
  loan_status TEXT DEFAULT 'active',
  priority_rank INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  loan_id TEXT NOT NULL REFERENCES loans(id),
  payment_date TEXT NOT NULL,
  payment_amount REAL NOT NULL,
  principal_paid REAL NOT NULL,
  interest_paid REAL NOT NULL,
  penalty_paid REAL DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'completed',
  transaction_id TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS income_sources (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  amount REAL NOT NULL,
  frequency TEXT NOT NULL,
  is_guaranteed INTEGER DEFAULT 0,
  start_date TEXT NOT NULL,
  end_date TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  expense_date TEXT NOT NULL,
  is_recurring INTEGER DEFAULT 0,
  frequency TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  loan_id TEXT NOT NULL REFERENCES loans(id),
  reminder_type TEXT NOT NULL,
  reminder_date TEXT NOT NULL,
  days_before INTEGER DEFAULT 3,
  is_sent INTEGER DEFAULT 0,
  sent_at TEXT,
  notification_method TEXT,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS debt_milestones (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  milestone_type TEXT NOT NULL,
  milestone_date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_involved REAL,
  celebration_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budget_goals (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  category TEXT NOT NULL,
  monthly_limit REAL NOT NULL,
  current_spent REAL DEFAULT 0,
  month_year TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS savings_goals (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  goal_name TEXT NOT NULL,
  target_amount REAL NOT NULL,
  current_amount REAL DEFAULT 0,
  target_date TEXT,
  priority INTEGER DEFAULT 1,
  is_achieved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_schedules (
  id TEXT PRIMARY KEY,
  loan_id TEXT NOT NULL REFERENCES loans(id),
  due_date TEXT NOT NULL,
  emi_number INTEGER NOT NULL,
  principal_due REAL NOT NULL,
  interest_due REAL NOT NULL,
  total_emi REAL NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  paid_amount REAL DEFAULT 0,
  paid_date TEXT,
  principal_outstanding REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS debt_strategies (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  strategy_name TEXT NOT NULL,
  is_active INTEGER DEFAULT 0,
  priority_order TEXT,
  extra_payment_amount REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('✅ Database tables created successfully!');
db.close();
