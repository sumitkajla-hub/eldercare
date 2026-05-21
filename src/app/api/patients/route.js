// Patients API Route - List and create patients
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { requireAuth } from '@/lib/auth';

// GET /api/patients - Get patients for the logged-in user
export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    // Build query based on role
    let query = {};
    if (session.user.role === 'user') {
      // Regular users only see their own patients
      query.userId = session.user.id;
    }
    // Admins and caregivers can see all patients

    const patients = await Patient.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: patients.length, patients },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create a new patient
export async function POST(request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const body = await request.json();
    const { name, age, gender, medicalConditions, allergies, emergencyContact, specialNotes } = body;

    // Validate required fields
    if (!name || !age || !gender) {
      return NextResponse.json(
        { success: false, message: 'Name, age, and gender are required' },
        { status: 400 }
      );
    }

    const patient = await Patient.create({
      userId: session.user.id,
      name,
      age,
      gender,
      medicalConditions: medicalConditions || [],
      allergies: allergies || [],
      emergencyContact: emergencyContact || {},
      specialNotes: specialNotes || '',
    });

    return NextResponse.json(
      { success: true, message: 'Patient created successfully', patient },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create patient error:', error);

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
