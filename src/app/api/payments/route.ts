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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, method, amount, transaction_ref, notes } = body;
    
    // Validate required fields
    if (!order_id || !method || !amount) {
      return NextResponse.json(
        { error: 'Order ID, method, and amount are required' },
        { status: 400 }
      );
    }
    
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}