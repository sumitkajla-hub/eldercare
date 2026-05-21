// Single Service API Route - GET, PUT, DELETE operations
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { requireRole } from '@/lib/auth';

// GET /api/services/[id] - Get single service
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service }, { status: 200 });
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update service (admin only)
export async function PUT(request, { params }) {
  try {
    const { error } = await requireRole('admin');
    if (error) return error;

    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const service = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Service updated successfully', service },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update service error:', error);

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

// DELETE /api/services/[id] - Delete service (admin only)
export async function DELETE(request, { params }) {
  try {
    const { error } = await requireRole('admin');
    if (error) return error;

    await connectDB();

    const { id } = await params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
