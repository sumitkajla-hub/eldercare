// Single User API Route - GET, PUT, DELETE operations
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, requireRole } from '@/lib/auth';

// GET /api/users/[id] - Get single user
export async function GET(request, { params }) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const { id } = await params;

    // Users can only view their own profile unless they are admin
    if (session.user.id !== id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(request, { params }) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const { id } = await params;

    // Users can only update their own profile unless they are admin
    if (session.user.id !== id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Prevent updating sensitive fields directly
    delete body.password;
    delete body.email;
    // Only admin can change roles
    if (session.user.role !== 'admin') {
      delete body.role;
    }

    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User updated successfully', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (admin or self)
export async function DELETE(request, { params }) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const { id } = await params;

    // Users can only delete their own account unless they are admin
    if (session.user.id !== id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
