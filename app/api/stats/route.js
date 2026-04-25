import { NextResponse } from 'next/server';
import { authenticate } from '../../lib/auth';
import { getStats } from '../../lib/stats';

export async function GET(request) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const response = await getStats(authResult.user.id);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get stats'
    }, { status: 500 });
  }
}