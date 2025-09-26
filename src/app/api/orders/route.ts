import { supabase } from '@/lib/supabase';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        payments (*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: orders, error, count } = await query;
    
    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      orders: orders || [],
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
    const {
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      items,
      notes,
      payment_method,
    } = body;
    
    // Validate required fields
    if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer details and items are required' },
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
    
    // Calculate total amount
    const total_amount = items.reduce(
      (sum: number, item: any) => sum + (item.quantity * item.price),
      0
    );
    
    // Start transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        customer_email,
        customer_address,
        total_amount,
        notes,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
    
    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order creation if items fail
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }
    
    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        method: payment_method || 'cash',
        status: 'unpaid',
        amount: total_amount,
      });
    
    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Don't rollback for payment errors, just log
    }
    
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}