import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CareNote from '@/models/CareNote';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    
    let query = {};
    if (bookingId) query.bookingId = bookingId;

    const notes = await CareNote.find(query)
      .populate('caregiverId')
      .sort({ timestamp: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { bookingId, caregiverId, note, vitals } = body;

    if (!bookingId || !caregiverId || !note) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const careNote = await CareNote.create({ bookingId, caregiverId, note, vitals });
    return NextResponse.json(careNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
