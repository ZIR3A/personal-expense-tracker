import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

let accessPrivateKey = null;
let accessPublicKey = null;
let refreshPrivateKey = null;
let refreshPublicKey = null;
let keysLoaded = false;

const readKey = (keyPath) => {
  const resolvedPath = path.resolve(process.cwd(), keyPath);
  if (!fs.existsSync(resolvedPath)) {
    return null;
  }
  return fs.readFileSync(resolvedPath, 'utf-8');
};

const loadKeys = () => {
  if (keysLoaded) return;
  
  const keysDir = process.env.KEYS_DIR || './keys';
  
  try {
    accessPrivateKey = readKey(`${keysDir}/access-private.pem`);
    accessPublicKey = readKey(`${keysDir}/access-public.pem`);
    refreshPrivateKey = readKey(`${keysDir}/refresh-private.pem`);
    refreshPublicKey = readKey(`${keysDir}/refresh-public.pem`);
    
    if (!accessPrivateKey || !accessPublicKey) {
      console.warn('JWT keys not found. Auth endpoints may not work without keys.');
    }
  } catch (e) {
    console.warn('JWT keys not found. Auth endpoints may not work without keys.');
  }
  
  keysLoaded = true;
};

export const authenticate = async (req) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      token = req.cookies.get('accessToken')?.value;
    }
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Access token required'
      }, { status: 401 });
    }
    
    loadKeys();
    
    if (!accessPublicKey) {
      return NextResponse.json({
        success: false,
        error: 'Server not configured for authentication'
      }, { status: 500 });
    }
    
    try {
      const decoded = jwt.verify(token, accessPublicKey, {
        algorithms: ['RS256']
      });
      
      return { user: { id: decoded.userId, email: decoded.email, role: decoded.role } };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return NextResponse.json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        }, { status: 401 });
      }
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 });
  }
};

export const optionalAuth = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    
    loadKeys();
    
    if (!accessPublicKey) {
      return null;
    }
    
    try {
      const decoded = jwt.verify(token, accessPublicKey, {
        algorithms: ['RS256']
      });
      
      return { user: { id: decoded.userId, email: decoded.email, role: decoded.role } };
    } catch (err) {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const generateTokens = async (user) => {
  loadKeys();
  
  if (!accessPrivateKey || !refreshPrivateKey) {
    throw new Error('JWT keys not configured');
  }
  
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role || 'user',
      type: 'access',
      version: Date.now()
    },
    accessPrivateKey,
    {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    }
  );
  
  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: 'refresh',
      version: Date.now(),
      jti: `${user.id}-${Date.now()}`
    },
    refreshPrivateKey,
    {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    }
  );
  
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (token) => {
  loadKeys();
  
  if (!refreshPublicKey) {
    throw new Error('JWT keys not configured');
  }
  return jwt.verify(token, refreshPublicKey, {
    algorithms: ['RS256']
  });
};