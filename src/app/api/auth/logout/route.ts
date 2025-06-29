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

    // Clear all NextAuth cookies more comprehensively
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Clear NextAuth specific cookies
    allCookies.forEach(cookie => {
      if (cookie.name.includes('next-auth') || cookie.name.includes('__Secure-next-auth') || cookie.name.includes('__Host-next-auth')) {
        cookieStore.set(cookie.name, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          domain: undefined // Let browser determine domain
        });
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
} 