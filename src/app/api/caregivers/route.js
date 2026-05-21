// Caregivers API Route - List/search and create caregivers
// Supports filtering by specialization, city, verified status, and minimum rating
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Caregiver from '@/models/Caregiver';
import { requireAuth } from '@/lib/auth';

// GET /api/caregivers - List caregivers with optional filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const city = searchParams.get('city');
    const verified = searchParams.get('verified');
    const minRating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build filter query
    const query = {};

    if (specialization) {
      query.specialization = specialization;
    }

    if (verified === 'true') {
      query.isVerified = true;
    } else if (verified === 'false') {
      query.isVerified = false;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Build the base query with populate
    let caregiverQuery = Caregiver.find(query)
      .populate('userId', 'name email phone avatar city address');

    // If city filter is provided, we need to filter by the populated user's city
    // We'll do this post-query for simplicity, or use aggregation
    const skip = (page - 1) * limit;
    let caregivers = await caregiverQuery.sort({ rating: -1 }).exec();

    // Filter by city if provided (filtering on populated field)
    if (city) {
      caregivers = caregivers.filter(
        (cg) => cg.userId && cg.userId.city && cg.userId.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    const total = caregivers.length;
    const paginatedCaregivers = caregivers.slice(skip, skip + limit);

    return NextResponse.json(
      {
        success: true,
        count: paginatedCaregivers.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        caregivers: paginatedCaregivers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get caregivers error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/caregivers - Create caregiver profile (for existing users with caregiver role)
export async function POST(request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    await connectDB();

    const body = await request.json();

    // Check if caregiver profile already exists for this user
    const existingCaregiver = await Caregiver.findOne({ userId: session.user.id });
    if (existingCaregiver) {
      return NextResponse.json(
        { success: false, message: 'Caregiver profile already exists for this user' },
        { status: 409 }
      );
    }

    const caregiver = await Caregiver.create({
      userId: session.user.id,
      specialization: body.specialization,
      qualifications: body.qualifications || [],
      experience: body.experience || 0,
      hourlyRate: body.hourlyRate || 0,
      dailyRate: body.dailyRate || 0,
      monthlyRate: body.monthlyRate || 0,
      serviceAreas: body.serviceAreas || [],
      languages: body.languages || [],
      availability: body.availability || {},
      bio: body.bio || '',
    });

    return NextResponse.json(
      { success: true, message: 'Caregiver profile created successfully', caregiver },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create caregiver error:', error);

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
