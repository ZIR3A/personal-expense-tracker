import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { config } from './config';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatCurrency = (amount, currency = config.currency.code) => {
  return `${config.currency.symbol}${new Intl.NumberFormat(config.currency.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getCategoryIcon = (category) => {
  const icons = {
    salary: 'briefcase',
    freelance: 'laptop',
    investment: 'trending-up',
    gift: 'gift',
    refund: 'rotate-ccw',
    other_income: 'plus-circle',
    groceries: 'shopping-cart',
    bills: 'file-text',
    utilities: 'zap',
    transport: 'car',
    entertainment: 'film',
    shopping: 'shopping-bag',
    health: 'heart',
    dining: 'coffee',
    subscriptions: 'repeat',
    other_expense: 'minus-circle'
  };
  return icons[category] || 'circle';
};

export const getCategoryColor = (category) => {
  const colors = {
    salary: 'text-emerald-400',
    freelance: 'text-cyan-400',
    investment: 'text-blue-400',
    gift: 'text-pink-400',
    refund: 'text-purple-400',
    other_income: 'text-teal-400',
    groceries: 'text-green-400',
    bills: 'text-red-400',
    utilities: 'text-yellow-400',
    transport: 'text-orange-400',
    entertainment: 'text-indigo-400',
    shopping: 'text-rose-400',
    health: 'text-red-400',
    dining: 'text-amber-400',
    subscriptions: 'text-violet-400',
    other_expense: 'text-gray-400'
  };
  return colors[category] || 'text-white';
};

export const CATEGORIES = {
  income: ['salary', 'freelance', 'investment', 'gift', 'refund', 'other_income'],
  expense: ['groceries', 'bills', 'utilities', 'transport', 'entertainment', 'shopping', 'health', 'dining', 'subscriptions', 'other_expense']
};

export const formatCategory = (category) => {
  return category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};