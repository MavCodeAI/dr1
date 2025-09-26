import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { runQuery, getAll } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const orderId = searchParams.get('order_id');

    let query = `
      SELECT p.*, o.customer_name, o.total_amount as order_total
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
    `;
    const params: any[] = [];

    const conditions = [];
    if (status) {
      conditions.push('p.status = ?');
      params.push(status);
    }
    if (orderId) {
      conditions.push('p.order_id = ?');
      params.push(orderId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.paid_at DESC, p.created_at DESC';

    const payments = getAll(query, params);

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { 
      order_id, 
      method, 
      status, 
      amount, 
      transaction_ref 
    } = await request.json();

    if (!order_id || !method || !amount) {
      return NextResponse.json(
        { error: 'Order ID, method, and amount are required' },
        { status: 400 }
      );
    }

    const paymentId = uuidv4();

    runQuery(
      'INSERT INTO payments (id, order_id, method, status, amount, transaction_ref, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        paymentId, 
        order_id, 
        method, 
        status || 'unpaid', 
        parseFloat(amount), 
        transaction_ref || null,
        status === 'paid' ? new Date().toISOString() : null
      ]
    );

    return NextResponse.json(
      { message: 'Payment record created successfully', id: paymentId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}