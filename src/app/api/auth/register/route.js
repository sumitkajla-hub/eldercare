// Register API Route
// POST: Creates a new user account
// If role is 'caregiver', also creates a linked Caregiver document
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Caregiver from '@/models/Caregiver';

export async function POST(request) {
  try {
    // Parse request body first (doesn't need DB)
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role, city, address, specialization, experience, hourlyRate, qualifications } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error during registration:', dbError);
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to connect to the database. Please try again later or contact support.',
        },
        { status: 503 }
      );
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create the user (password is hashed automatically by the pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: role || 'user',
      city: city || '',
      address: address || '',
    });

    // If registering as a caregiver, create the linked Caregiver document
    if (role === 'caregiver') {
      try {
        await Caregiver.create({
          userId: user._id,
          specialization: specialization || 'nursing',
          experience: experience ? Number(experience) : 0,
          hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
          qualifications: Array.isArray(qualifications) ? qualifications : [],
        });
      } catch (caregiverError) {
        console.error('Error creating caregiver profile:', caregiverError);
        // User was created but caregiver profile failed - still return success
        // The user can update their caregiver profile later
      }
    }

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
    };

    return NextResponse.json(
      { success: true, message: 'Registration successful', user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Handle connection errors that may occur during operations
    if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('buffering timed out'))) {
      return NextResponse.json(
        { success: false, message: 'Unable to connect to the database. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
