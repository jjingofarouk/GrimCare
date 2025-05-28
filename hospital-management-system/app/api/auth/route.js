import { NextResponse } from 'next/server';
import { registerUser, loginUser } from '../../auth/authService';

export async function POST(request) {
  try {
    const { action, ...data } = await request.json();

    if (action === 'register') {
      const result = await registerUser(data);
      return NextResponse.json(result, { status: 201 });
    } else if (action === 'login') {
      const result = await loginUser(data);
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}