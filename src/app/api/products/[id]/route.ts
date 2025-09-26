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

    const product = getOne(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
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

    const { name, category, description, price, stock } = await request.json();

    // Check if product exists
    const existingProduct = getOne(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    );

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(parseFloat(price));
    }
    if (stock !== undefined) {
      updates.push('stock = ?');
      values.push(parseInt(stock));
      
      // Log inventory change if stock changed
      const oldStock = existingProduct.stock;
      const newStock = parseInt(stock);
      const difference = newStock - oldStock;
      
      if (difference !== 0) {
        const changeType = difference > 0 ? 'add' : 'adjustment';
        runQuery(
          'INSERT INTO inventory_logs (product_id, change_type, quantity, note, created_by) VALUES (?, ?, ?, ?, ?)',
          [params.id, changeType, Math.abs(difference), `Stock ${difference > 0 ? 'increased' : 'decreased'} by ${Math.abs(difference)}`, user.id]
        );
      }
    }

    values.push(params.id);

    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    runQuery(query, values);

    // Get updated product
    const updatedProduct = getOne(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
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
        { error: 'Only owners can delete products' },
        { status: 403 }
      );
    }

    // Check if product exists
    const product = getOne(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the product (hard delete for simplicity)
    runQuery('DELETE FROM products WHERE id = ?', [params.id]);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}