import { NextResponse } from 'next/server';
import { authenticate } from '../../lib/auth';
import { storage } from '../../lib/storage';

export async function GET(request) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const budgets = await storage.budgets.findByUserId(authResult.user.id);
    
    return NextResponse.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    console.error('Get budgets error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get budgets'
    }, { status: 500 });
  }
}

export async function PUT(request) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const body = await request.json();
    const { budgets } = body;
    
    const updated = await storage.budgets.update(authResult.user.id, budgets);
    
    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update budgets error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update budgets'
    }, { status: 500 });
  }
}