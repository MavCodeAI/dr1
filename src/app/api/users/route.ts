import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, hashPassword } from '@/lib/auth';
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

    if (user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const users = getAll(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error('Get users error:', error);
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

    if (user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const { name, email, phone, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    runQuery(
      'INSERT INTO users (id, name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, phone || null, hashedPassword, role || 'staff']
    );

    return NextResponse.json(
      { message: 'User created successfully', id: userId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create user error:', error);
    
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}