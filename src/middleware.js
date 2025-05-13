import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Skip middleware for setup page
  if (request.nextUrl.pathname.startsWith('/setup')) {
    return NextResponse.next();
  }

  try {
    // Check if system is initialized
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${API_URL}/setup/check-initialization`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // If system is not initialized, redirect to setup page
    if (!data.data.initialized) {
      return NextResponse.redirect(new URL('/setup', request.url));
    }

    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Error checking system initialization:', error);
    
    // In case of error, allow the request to continue
    // The application should handle initialization check on its own
    return NextResponse.next();
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
