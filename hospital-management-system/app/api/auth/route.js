import { NextResponse } from 'next/server';
import { loginUser, registerUser } from '../../lib/auth';

export async function POST(request) {
  try {
    const { action, email, password, name, role } = await request.json();
    console.log(`API /auth: Action=${action}, Email=${email}, Role=${role}`);

    if (action === 'login') {
      const result = await loginUser({ email, password });
      return NextResponse.json(result);
    } else if (action === 'register') {
      const result = await registerUser({ email, password, name, role });
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API /auth error:', error.message);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 401 });
  }
}