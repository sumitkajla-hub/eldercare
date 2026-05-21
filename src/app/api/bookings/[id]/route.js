import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('patientId')
      .populate('caregiverId')
      .populate('serviceId');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const booking = await Booking.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true })
      .populate('userId', 'name email')
      .populate('patientId')
      .populate('caregiverId')
      .populate('serviceId');

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
