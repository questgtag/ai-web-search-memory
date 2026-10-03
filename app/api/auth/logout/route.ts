import { NextResponse } from 'next/server';
import { loginAccount, getAuthCookieOptions } from '@/lib/helpers';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await loginAccount(formData);

    cookies().set('ai_session', result.token, getAuthCookieOptions());
    return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  } catch (error: any) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
}
