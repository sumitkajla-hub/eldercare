// Services API Route - List active services and create new ones (admin)
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { requireRole } from '@/lib/auth';

// GET /api/services - List all active services, optionally filter by category
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Build filter query - only show active services by default
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    const services = await Service.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: services.length, services },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service (admin only)
export async function POST(request) {
  try {
    // Only admins can create services
    const { error } = await requireRole('admin');
    if (error) return error;

    await connectDB();

    const body = await request.json();
    const { name, description, category, icon, duration, basePrice, requiredQualification } = body;

    // Validate required fields
    if (!name || !description || !category || basePrice === undefined) {
      return NextResponse.json(
        { success: false, message: 'Name, description, category, and base price are required' },
        { status: 400 }
      );
    }

    const service = await Service.create({
      name,
      description,
      category,
      icon: icon || '',
      duration: duration || '',
      basePrice,
      requiredQualification: requiredQualification || '',
    });

    return NextResponse.json(
      { success: true, message: 'Service created successfully', service },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service error:', error);

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
