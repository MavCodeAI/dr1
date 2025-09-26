<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { runQuery, getOne } from '@/lib/database';
=======
import { supabase } from '@/lib/supabase';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
<<<<<<< HEAD
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
=======
    const { data: payment, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders (
          order_number,
          customer_name,
          customer_phone,
          customer_address,
          total_amount
        )
      `)
      .eq('id', params.id)
      .single();
    
    if (error) {
      console.error('Error fetching payment:', error);
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
<<<<<<< HEAD
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
=======
    return NextResponse.json({ payment });
  } catch (error) {
    console.error('API Error:', error);
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
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
<<<<<<< HEAD
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
=======
    const body = await request.json();
    const { status, amount, method, transaction_ref, notes, paid_at } = body;
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'paid' && !paid_at) {
        updateData.paid_at = new Date().toISOString();
      }
    }
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (method !== undefined) updateData.method = method;
    if (transaction_ref !== undefined) updateData.transaction_ref = transaction_ref;
    if (notes !== undefined) updateData.notes = notes;
    if (paid_at !== undefined) updateData.paid_at = paid_at;
    
    const { data: payment, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        orders (
          order_number,
          customer_name,
          customer_phone,
          customer_address,
          total_amount
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating payment:', error);
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ payment });
  } catch (error) {
    console.error('API Error:', error);
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}