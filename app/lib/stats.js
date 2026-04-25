import { storage } from './storage';
import { Parser } from 'json2csv';

const calculateRunningBalance = (transactions) => {
  let balance = 0;
  const sorted = [...transactions].sort((a, b) => 
    new Date(a.date) - new Date(b.date) || new Date(a.createdAt) - new Date(b.createdAt)
  );
  
  return sorted.map(t => {
    balance += t.type === 'income' ? t.amount : -t.amount;
    return { ...t, runningBalance: balance };
  });
};

export const exportDailyCSV = async (transactions, month) => {
  const filtered = transactions.filter(t => t.date.startsWith(month));
  const withBalance = calculateRunningBalance(filtered);
  
  const fields = [
    { label: 'Date', value: 'date' },
    { label: 'Type', value: 'type' },
    { label: 'Category', value: 'category' },
    { label: 'Description', value: 'description' },
    { label: 'Amount', value: row => row.type === 'income' ? `+${row.amount.toFixed(2)}` : `-${row.amount.toFixed(2)}` },
    { label: 'Balance', value: row => row.runningBalance.toFixed(2) }
  ];
  
  const parser = new Parser({ fields });
  return parser.parse(withBalance);
};

export const exportMonthlyCSV = async (transactions, year) => {
  const monthlyData = {};
  
  transactions.forEach(t => {
    const month = t.date.substring(0, 7);
    if (month.startsWith(year)) {
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0, categories: {} };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
        monthlyData[month].categories[t.category] = (monthlyData[month].categories[t.category] || 0) + t.amount;
      }
    }
  });
  
  const rows = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => {
      const topCategory = Object.entries(data.categories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
      return {
        month,
        totalIncome: data.income.toFixed(2),
        totalExpenses: data.expenses.toFixed(2),
        netBalance: (data.income - data.expenses).toFixed(2),
        topCategory
      };
    });
  
  if (rows.length === 0) {
    return 'Month,Total Income,Total Expenses,Net Balance,Top Category\n';
  }
  
  const fields = ['Month', 'Total Income', 'Total Expenses', 'Net Balance', 'Top Category'];
  const parser = new Parser({ fields });
  return parser.parse(rows);
};

export const generateStats = async (transactions) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const categoryTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  
  const topCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  
  const daysWithTransactions = new Set(
    monthlyTransactions.map(t => t.date)
  ).size;
  
  return {
    balance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    transactionsThisMonth: monthlyTransactions.length,
    topCategory,
    dailyAverage: daysWithTransactions > 0 ? (monthlyExpenses / daysWithTransactions).toFixed(2) : 0,
    byCategory: Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total: Number(total.toFixed(2))
    })),
    recentTransactions: transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  };
};

export const getStats = async (userId) => {
  const transactions = await storage.transactions.findByUserId(userId);
  const stats = await generateStats(transactions);
  const budgets = await storage.budgets.findByUserId(userId);
  
  return {
    success: true,
    data: {
      ...stats,
      budgets: budgets.budgets
    }
  };
};