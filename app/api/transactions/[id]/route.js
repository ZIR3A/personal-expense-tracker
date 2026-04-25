import { NextResponse } from 'next/server';
import { authenticate } from '../../../lib/auth';
import { storage } from '../../../lib/storage';

export async function PUT(request, { params }) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const { id } = params;
    const body = await request.json();
    
    const transaction = await storage.transactions.update(authResult.user.id, id, body);
    
    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update transaction'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const { id } = params;
    
    await storage.transactions.delete(authResult.user.id, id);
    
    return NextResponse.json({
      success: true,
      message: 'Transaction deleted'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete transaction'
    }, { status: 500 });
  }
}