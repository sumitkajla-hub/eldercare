// Register API Route
// POST: Creates a new user account
// If role is 'caregiver', also creates a linked Caregiver document
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Caregiver from '@/models/Caregiver';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password, phone, role, city, address, specialization } = body;

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
      await Caregiver.create({
        userId: user._id,
        specialization: specialization || 'nursing',
      });
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

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
