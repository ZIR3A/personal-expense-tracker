import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../../lib/storage';
import { generateTokens, verifyRefreshToken } from '../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, preferences } = body;
    
    const existingUser = await storage.users.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email already registered'
      }, { status: 409 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = {
      id: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      googleId: null,
      role: 'user',
      preferences: {
        currency: preferences?.currency || 'USD',
        theme: preferences?.theme || 'dark'
      },
      createdAt: new Date().toISOString()
    };
    
    await storage.users.create(user);
    
    const tokens = await generateTokens(user);
    
    await storage.refreshTokens.add({
      token: tokens.refreshToken,
      userId: user.id,
      createdAt: new Date().toISOString()
    });
    
    const userResponse = { ...user };
    delete userResponse.password;
    
    const response = NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        accessToken: tokens.accessToken
      }
    }, { status: 201 });
    
    response.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/'
    });
    
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh'
    });
    
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({
      success: false,
      error: 'Registration failed'
    }, { status: 500 });
  }
}
