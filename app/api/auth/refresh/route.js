import { NextResponse } from 'next/server';
import { storage } from '../../../lib/storage';
import { generateTokens, verifyRefreshToken } from '../../../lib/auth';

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value || (await request.json()).refreshToken;
    
    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: 'Refresh token required'
      }, { status: 401 });
    }
    
    const isBlacklisted = await storage.refreshTokens.isBlacklisted(refreshToken);
    if (isBlacklisted) {
      return NextResponse.json({
        success: false,
        error: 'Token has been revoked'
      }, { status: 401 });
    }
    
    const decoded = await verifyRefreshToken(refreshToken);
    
    const user = await storage.users.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 401 });
    }
    
    await storage.refreshTokens.remove(refreshToken);
    
    const tokens = await generateTokens(user);
    
    await storage.refreshTokens.add({
      token: tokens.refreshToken,
      userId: user.id,
      createdAt: new Date().toISOString()
    });
    
    const response = NextResponse.json({
      success: true,
      data: {
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
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({
        success: false,
        error: 'Refresh token expired'
      }, { status: 401 });
    }
    console.error('Refresh error:', error);
    return NextResponse.json({
      success: false,
      error: 'Token refresh failed'
    }, { status: 500 });
  }
}
