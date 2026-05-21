// Auth Utility Functions
// Provides server-side session helpers and role-based access control
import { getServerSession as getNextAuthSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// Get the current server session
export async function getServerSession() {
  return await getNextAuthSession(authOptions);
}

// Middleware: Require authentication - returns session or error response
export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}

// Middleware: Require specific role(s) - returns session or error response
// roles can be a single string or an array of strings
export async function requireRole(roles) {
  const { error, session } = await requireAuth();

  if (error) {
    return { error, session: null };
  }

  // Normalize roles to an array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(session.user.role)) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Access denied. Insufficient permissions.' },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}
