// Single Caregiver API Route - GET and PUT operations
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Caregiver from '@/models/Caregiver';
import { requireAuth } from '@/lib/auth';

// GET /api/caregivers/[id] - Get single caregiver profile
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const caregiver = await Caregiver.findById(id).populate(
      'userId',
      'name email phone avatar city address'
    );

    if (!caregiver) {
      return NextResponse.json(
        { success: false, message: 'Caregiver not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, caregiver }, { status: 200 });
  } catch (error) {
    console.error('Get caregiver error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/caregivers/[id] - Update caregiver profile
export async function PUT(request, { params }) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const { id } = await params;
    const existingCaregiver = await Caregiver.findById(id);

    if (!existingCaregiver) {
      return NextResponse.json(
        { success: false, message: 'Caregiver not found' },
        { status: 404 }
      );
    }

    // Only the caregiver themselves or an admin can update the profile
    if (
      existingCaregiver.userId.toString() !== session.user.id &&
      session.user.role !== 'admin'
    ) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Prevent non-admin users from updating verification status and ratings
    if (session.user.role !== 'admin') {
      delete body.isVerified;
      delete body.rating;
      delete body.totalReviews;
      delete body.totalBookings;
    }

    const caregiver = await Caregiver.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('userId', 'name email phone avatar city address');

    return NextResponse.json(
      { success: true, message: 'Caregiver updated successfully', caregiver },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update caregiver error:', error);

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
