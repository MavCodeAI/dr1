import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { runQuery, getOne } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payment = getOne(
      `SELECT p.*, o.customer_name, o.total_amount as order_total
       FROM payments p
       LEFT JOIN orders o ON p.order_id = o.id
       WHERE p.id = ?`,
      [params.id]
    );
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { method, status, amount, transaction_ref } = await request.json();

    // Check if payment exists
    const existingPayment = getOne(
      'SELECT * FROM payments WHERE id = ?',
      [params.id]
    );

    if (!existingPayment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (method !== undefined) {
      updates.push('method = ?');
      values.push(method);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
      
      // Set paid_at timestamp if status is 'paid'
      if (status === 'paid') {
        updates.push('paid_at = ?');
        values.push(new Date().toISOString());
      } else if (status !== 'paid') {
        updates.push('paid_at = ?');
        values.push(null);
      }
    }
    if (amount !== undefined) {
      updates.push('amount = ?');
      values.push(parseFloat(amount));
    }
    if (transaction_ref !== undefined) {
      updates.push('transaction_ref = ?');
      values.push(transaction_ref);
    }

    values.push(params.id);

    const query = `UPDATE payments SET ${updates.join(', ')} WHERE id = ?`;
    runQuery(query, values);

    // Get updated payment
    const updatedPayment = getOne(
      `SELECT p.*, o.customer_name, o.total_amount as order_total
       FROM payments p
       LEFT JOIN orders o ON p.order_id = o.id
       WHERE p.id = ?`,
      [params.id]
    );

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only owners can delete payments' },
        { status: 403 }
      );
    }

    // Check if payment exists
    const payment = getOne(
      'SELECT * FROM payments WHERE id = ?',
      [params.id]
    );

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Delete the payment
    runQuery('DELETE FROM payments WHERE id = ?', [params.id]);

    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}