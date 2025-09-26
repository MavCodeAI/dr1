import { supabase } from '@/lib/supabase';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ payment });
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}