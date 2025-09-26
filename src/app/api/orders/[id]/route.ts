import { supabase } from '@/lib/supabase';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        payments (*)
      `)
      .eq('id', params.id)
      .single();
    
    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('API Error:', error);
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
    const body = await request.json();
    const { status, customer_name, customer_phone, customer_address, notes } = body;
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (customer_name !== undefined) updateData.customer_name = customer_name;
    if (customer_phone !== undefined) updateData.customer_phone = customer_phone;
    if (customer_address !== undefined) updateData.customer_address = customer_address;
    if (notes !== undefined) updateData.notes = notes;
    
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        payments (*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}