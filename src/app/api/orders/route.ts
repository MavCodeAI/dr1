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

    let query = `
      SELECT o.*, 
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
    `;
    
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    
    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const orders = getAll(query, params);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
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
      customer_name, 
      customer_phone, 
      customer_address, 
      items,
      payment_method = 'cash',
      payment_status = 'unpaid'
    } = await request.json();

    if (!customer_name || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name and items are required' },
        { status: 400 }
      );
    }

    const orderId = uuidv4();
    let totalAmount = 0;

    // Calculate total
    for (const item of items) {
      totalAmount += parseFloat(item.price) * parseInt(item.quantity);
    }

    // Create order
    runQuery(
      'INSERT INTO orders (id, customer_name, customer_phone, customer_address, total_amount, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, customer_name, customer_phone, customer_address, totalAmount, user.id]
    );

    // Create order items and update stock
    for (const item of items) {
      const itemId = uuidv4();
      const subtotal = parseFloat(item.price) * parseInt(item.quantity);
      
      runQuery(
        'INSERT INTO order_items (id, order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [itemId, orderId, item.product_id, parseInt(item.quantity), parseFloat(item.price), subtotal]
      );

      // Update product stock
      runQuery(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [parseInt(item.quantity), item.product_id]
      );

      // Log inventory change
      runQuery(
        'INSERT INTO inventory_logs (product_id, change_type, quantity, note, created_by) VALUES (?, ?, ?, ?, ?)',
        [item.product_id, 'sale', parseInt(item.quantity), `Order ${orderId}`, user.id]
      );
    }

    // Create payment record
    const paymentId = uuidv4();
    runQuery(
      'INSERT INTO payments (id, order_id, method, status, amount) VALUES (?, ?, ?, ?, ?)',
      [paymentId, orderId, payment_method, payment_status, totalAmount]
    );

    return NextResponse.json(
      { message: 'Order created successfully', id: orderId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}