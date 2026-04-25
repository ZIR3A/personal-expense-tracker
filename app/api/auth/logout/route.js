import { NextResponse } from 'next/server';
import { authenticate } from '../../../lib/auth';
import { storage } from '../../../lib/storage';

export async function POST(request) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (refreshToken) {
      await storage.refreshTokens.add({
        token: refreshToken,
        userId: authResult.user.id,
        createdAt: new Date().toISOString(),
        revokedAt: new Date().toISOString()
      });
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });
    
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/api/auth/refresh'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}
