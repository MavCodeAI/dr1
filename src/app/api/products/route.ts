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
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM products';
    const params: any[] = [];

    if (category || search) {
      query += ' WHERE';
      const conditions = [];
      
      if (category) {
        conditions.push(' category = ?');
        params.push(category);
      }
      
      if (search) {
        conditions.push(' (name LIKE ? OR description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += conditions.join(' AND');
    }

    query += ' ORDER BY created_at DESC';

    const products = getAll(query, params);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
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

    const { name, category, description, price, stock } = await request.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const productId = uuidv4();
    const stockValue = parseInt(stock) || 0;

    runQuery(
      'INSERT INTO products (id, name, category, description, price, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, name, category || 'main', description, parseFloat(price), stockValue]
    );

    // Log inventory change if stock is added
    if (stockValue > 0) {
      runQuery(
        'INSERT INTO inventory_logs (product_id, change_type, quantity, note, created_by) VALUES (?, ?, ?, ?, ?)',
        [productId, 'add', stockValue, 'Initial stock', user.id]
      );
    }

    return NextResponse.json(
      { message: 'Product created successfully', id: productId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}