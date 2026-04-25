import { NextResponse } from 'next/server';
import { authenticate } from '../../../lib/auth';
import { storage } from '../../../lib/storage';

export async function GET(request) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const user = await storage.users.findById(authResult.user.id);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    const userResponse = { ...user };
    delete userResponse.password;
    
    return NextResponse.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get user'
    }, { status: 500 });
  }
}
