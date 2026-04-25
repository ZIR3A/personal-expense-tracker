import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { storage } from '../../../lib/storage';
import { generateTokens } from '../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    const user = await storage.users.findByEmail(email);
    
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
    if (user.googleId && !user.password) {
      return NextResponse.json({
        success: false,
        error: 'Please login with Google'
      }, { status: 401 });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
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
    });
    
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
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
}
