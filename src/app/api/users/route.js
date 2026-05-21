// Users API Route - List all users (admin only)
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/auth';

// GET /api/users - List all users (admin only)
export async function GET() {
  try {
    // Only admins can list all users
    const { error, session } = await requireRole('admin');
    if (error) return error;

    await connectDB();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: users.length, users },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
