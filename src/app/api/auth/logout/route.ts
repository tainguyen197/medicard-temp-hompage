import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user) {
      // Log the logout event
      console.log(`User ${session.user.email} logged out`);
      
      // You could add audit logging here
      // await Logger.logAuthEvent({
      //   event: 'LOGOUT',
      //   userId: session.user.id,
      //   email: session.user.email
      // });
    }

    // Clear all NextAuth cookies
    const cookieStore = await cookies();
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token'
    ];

    cookiesToClear.forEach(cookieName => {
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
} 