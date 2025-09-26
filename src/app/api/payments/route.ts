<<<<<<< HEAD
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
=======
import { supabase } from '@/lib/supabase';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const order_id = searchParams.get('order_id');
    
    let query = supabase
      .from('payments')
      .select(`
        *,
        orders (
          order_number,
          customer_name,
          customer_phone,
          total_amount
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (order_id) {
      query = query.eq('order_id', order_id);
    }
    
    const { data: payments, error, count } = await query;
    
    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      payments: payments || [],
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
    });
  } catch (error) {
    console.error('API Error:', error);
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
<<<<<<< HEAD
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

=======
    const body = await request.json();
    const { order_id, method, amount, transaction_ref, notes } = body;
    
    // Validate required fields
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
    if (!order_id || !method || !amount) {
      return NextResponse.json(
        { error: 'Order ID, method, and amount are required' },
        { status: 400 }
      );
    }
<<<<<<< HEAD

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
=======
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        order_id,
        method,
        amount: parseFloat(amount),
        transaction_ref,
        notes,
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment:', error);
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
>>>>>>> 11386d68880a97c39baaa5e8f6e0c544344b0626
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}