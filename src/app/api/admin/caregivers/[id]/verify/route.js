import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Caregiver from '@/models/Caregiver';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const caregiver = await Caregiver.findByIdAndUpdate(
      id,
      { isVerified: body.isVerified },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!caregiver) {
      return NextResponse.json({ error: 'Caregiver not found' }, { status: 404 });
    }

    return NextResponse.json(caregiver);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
