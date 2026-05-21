'use client';

// AuthProvider - Wraps next-auth SessionProvider for client-side session access
import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
