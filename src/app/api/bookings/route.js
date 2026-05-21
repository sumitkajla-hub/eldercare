import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Caregiver from '@/models/Caregiver';

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    let query = {};

    if (session && session.user) {
      if (session.user.role === 'user') {
        query.userId = session.user.id;
      } else if (session.user.role === 'caregiver') {
        const caregiver = await Caregiver.findOne({ userId: session.user.id });
        if (caregiver) {
          query.caregiverId = caregiver._id;
        }
      }
      // admin sees all
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('patientId', 'name age gender medicalConditions')
      .populate('caregiverId')
      .populate('serviceId', 'name category basePrice icon')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { patientId, caregiverId, serviceId, bookingType, startDate, endDate, scheduledTime, totalAmount } = body;

    if (!patientId || !caregiverId || !serviceId || !bookingType || !startDate || !totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await Booking.create({
      userId: session.user.id,
      patientId,
      caregiverId,
      serviceId,
      bookingType,
      startDate,
      endDate,
      scheduledTime,
      totalAmount,
      status: 'pending',
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
