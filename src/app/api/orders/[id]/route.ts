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

    const order = getOne(
      `SELECT o.*, 
        GROUP_CONCAT(
          json_object(
            'id', oi.id,
            'product_name', p.name,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.subtotal
          )
        ) as items,
        pay.method as payment_method,
        pay.status as payment_status,
        pay.amount as payment_amount,
        pay.paid_at
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN payments pay ON o.id = pay.order_id
      WHERE o.id = ?
      GROUP BY o.id`,
      [params.id]
    );
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Get order error:', error);
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

    const { status, customer_name, customer_phone, customer_address } = await request.json();

    // Check if order exists
    const existingOrder = getOne(
      'SELECT * FROM orders WHERE id = ?',
      [params.id]
    );

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates = ['updated_at = ?'];
    const values = [new Date().toISOString()];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (customer_name !== undefined) {
      updates.push('customer_name = ?');
      values.push(customer_name);
    }
    if (customer_phone !== undefined) {
      updates.push('customer_phone = ?');
      values.push(customer_phone);
    }
    if (customer_address !== undefined) {
      updates.push('customer_address = ?');
      values.push(customer_address);
    }

    values.push(params.id);

    const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
    runQuery(query, values);

    // Get updated order
    const updatedOrder = getOne(
      `SELECT o.*, 
        GROUP_CONCAT(
          json_object(
            'id', oi.id,
            'product_name', p.name,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'subtotal', oi.subtotal
          )
        ) as items,
        pay.method as payment_method,
        pay.status as payment_status,
        pay.amount as payment_amount
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN payments pay ON o.id = pay.order_id
      WHERE o.id = ?
      GROUP BY o.id`,
      [params.id]
    );

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
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
        { error: 'Only owners can delete orders' },
        { status: 403 }
      );
    }

    // Check if order exists
    const order = getOne(
      'SELECT * FROM orders WHERE id = ?',
      [params.id]
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Delete related records first (due to foreign key constraints)
    runQuery('DELETE FROM payments WHERE order_id = ?', [params.id]);
    runQuery('DELETE FROM order_items WHERE order_id = ?', [params.id]);
    runQuery('DELETE FROM orders WHERE id = ?', [params.id]);

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}