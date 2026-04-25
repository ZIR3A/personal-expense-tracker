import { NextResponse } from 'next/server';
import { authenticate } from '../../lib/auth';
import { storage } from '../../lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    
    let transactions = await storage.transactions.findByUserId(authResult.user.id);
    
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    if (category) {
      transactions = transactions.filter(t => t.category === category);
    }
    
    if (startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    
    if (endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      transactions = transactions.filter(t => 
        t.description?.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
      );
    }
    
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return NextResponse.json({
      success: true,
      data: { transactions }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get transactions'
    }, { status: 500 });
  }
}

export async function POST(request) {
  const authResult = await authenticate(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const body = await request.json();
    const { amount, description, category, date, type, recurring } = body;
    
    const transaction = {
      id: uuidv4(),
      amount: parseFloat(amount),
      description,
      category,
      date,
      type,
      recurring: recurring || false,
      createdAt: new Date().toISOString()
    };
    
    await storage.transactions.create(authResult.user.id, transaction);
    
    return NextResponse.json({
      success: true,
      data: { transaction }
    }, { status: 201 });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create transaction'
    }, { status: 500 });
  }
}
