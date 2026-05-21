// Single Patient API Route - GET, PUT, DELETE operations
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { requireAuth } from '@/lib/auth';

// GET /api/patients/[id] - Get single patient
export async function GET(request, { params }) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const { id } = await params;
    const patient = await Patient.findById(id).populate('userId', 'name email phone');

    if (!patient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    // Check ownership - regular users can only view their own patients
    if (
      session.user.role === 'user' &&
      patient.userId._id.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, patient }, { status: 200 });
  } catch (error) {
    console.error('Get patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/patients/[id] - Update patient
export async function PUT(request, { params }) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const { id } = await params;
    const existingPatient = await Patient.findById(id);

    if (!existingPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (
      session.user.role === 'user' &&
      existingPatient.userId.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const patient = await Patient.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, message: 'Patient updated successfully', patient },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update patient error:', error);

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

// DELETE /api/patients/[id] - Delete patient
export async function DELETE(request, { params }) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const { id } = await params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (
      session.user.role === 'user' &&
      patient.userId.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    await Patient.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Patient deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
