import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDB() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'business.db');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDB() {
  if (db) {
    db.close();
    db = null;
  }
}

// Helper function to run queries safely
export function runQuery(query: string, params: any[] = []) {
  const database = getDB();
  try {
    return database.prepare(query).run(params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get single result
export function getOne(query: string, params: any[] = []) {
  const database = getDB();
  try {
    return database.prepare(query).get(params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get multiple results
export function getAll(query: string, params: any[] = []) {
  const database = getDB();
  try {
    return database.prepare(query).all(params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}