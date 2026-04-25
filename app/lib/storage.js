import fs from 'fs';
import path from 'path';

const DATA_PATH = process.env.DATA_PATH || './data';

let dataDirCache = null;

const getDataDir = () => {
  if (dataDirCache) return dataDirCache;
  dataDirCache = path.join(process.cwd(), DATA_PATH);
  return dataDirCache;
};

const ensureDataDir = () => {
  const dir = getDataDir();
  return dir;
};

const getFilePath = (filename) => {
  return path.join(getDataDir(), filename);
};

const readJSON = (filename) => {
  const filePath = getFilePath(filename);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeJSON = (filename, data) => {
  const dir = getDataDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const storage = {
  users: {
    findAll: () => readJSON('users.json'),
    findById: async (id) => {
      const users = readJSON('users.json');
      return users.find(u => u.id === id);
    },
    findByEmail: async (email) => {
      const users = readJSON('users.json');
      return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    findByGoogleId: async (googleId) => {
      const users = readJSON('users.json');
      return users.find(u => u.googleId === googleId);
    },
    create: async (user) => {
      const users = readJSON('users.json');
      users.push(user);
      writeJSON('users.json', users);
      return user;
    },
    update: async (id, updates) => {
      const users = readJSON('users.json');
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        writeJSON('users.json', users);
        return users[index];
      }
      return null;
    },
    delete: async (id) => {
      const users = readJSON('users.json');
      const filtered = users.filter(u => u.id !== id);
      writeJSON('users.json', filtered);
    }
  },
  
  refreshTokens: {
    findAll: () => readJSON('refreshTokens.json'),
    findByToken: async (token) => {
      const tokens = readJSON('refreshTokens.json');
      return tokens.find(t => t.token === token);
    },
    add: async (tokenData) => {
      const tokens = readJSON('refreshTokens.json');
      tokens.push(tokenData);
      writeJSON('refreshTokens.json', tokens);
    },
    remove: async (token) => {
      const tokens = readJSON('refreshTokens.json');
      const filtered = tokens.filter(t => t.token !== token);
      writeJSON('refreshTokens.json', filtered);
    },
    removeByUserId: async (userId) => {
      const tokens = readJSON('refreshTokens.json');
      const filtered = tokens.filter(t => t.userId !== userId);
      writeJSON('refreshTokens.json', filtered);
    },
    isBlacklisted: async (token) => {
      const tokens = readJSON('refreshTokens.json');
      return tokens.some(t => t.token === token);
    }
  },
  
  transactions: {
    findByUserId: async (userId) => {
      const filename = `transactions_${userId}.json`;
      return readJSON(filename);
    },
    findById: async (userId, transactionId) => {
      const transactions = await storage.transactions.findByUserId(userId);
      return transactions.find(t => t.id === transactionId);
    },
    create: async (userId, transaction) => {
      const filename = `transactions_${userId}.json`;
      const transactions = readJSON(filename);
      transactions.push(transaction);
      writeJSON(filename, transactions);
      return transaction;
    },
    update: async (userId, transactionId, updates) => {
      const filename = `transactions_${userId}.json`;
      const transactions = readJSON(filename);
      const index = transactions.findIndex(t => t.id === transactionId);
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates };
        writeJSON(filename, transactions);
        return transactions[index];
      }
      return null;
    },
    delete: async (userId, transactionId) => {
      const filename = `transactions_${userId}.json`;
      const transactions = readJSON(filename);
      const filtered = transactions.filter(t => t.id !== transactionId);
      writeJSON(filename, filtered);
    }
  },
  
  budgets: {
    findByUserId: async (userId) => {
      const filename = `budgets_${userId}.json`;
      const data = readJSON(filename);
      if (!data || data.length === 0) {
        return { userId, budgets: {}, updatedAt: new Date().toISOString() };
      }
      return data[0];
    },
    update: async (userId, budgets) => {
      const filename = `budgets_${userId}.json`;
      const data = {
        userId,
        budgets,
        updatedAt: new Date().toISOString()
      };
      writeJSON(filename, data);
      return data;
    }
  }
};

export default storage;