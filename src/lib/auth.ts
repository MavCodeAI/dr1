import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { getOne } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'owner' | 'staff';
  created_at: string;
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Get user from request
export function getUserFromRequest(request: NextRequest): User | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return null;
    }

    // Get fresh user data from database
    const user = getOne(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [decoded.id]
    ) as User;

    return user;
  } catch (error) {
    return null;
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = getOne(
      'SELECT id, name, email, phone, role, password, created_at FROM users WHERE email = ?',
      [email]
    ) as any;

    if (!user) {
      return null;
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}