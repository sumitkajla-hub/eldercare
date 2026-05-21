import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('SEED ERROR:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
