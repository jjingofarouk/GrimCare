import { NextResponse } from 'next/server';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export async function POST(request) {
  try {
    const { action, email, password, name, role } = await request.json();
    console.log(`API /auth: Action=${action}, Email=${email}, Role=${role}`);

    if (action === 'login') {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      return NextResponse.json(
        { user: { uid: user.uid, email: user.email }, token },
        {
          headers: {
            'Set-Cookie': `token=${token}; Path=/; Max-Age=3600; SameSite=Strict; Secure`,
          },
        }
      );
    } else if (action === 'register') {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      const registerRes = await fetch(`${request.headers.get('origin')}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, email, name, role: role || 'USER' }),
      });
      if (!registerRes.ok) throw new Error('Registration failed');
      const { user: registeredUser } = await registerRes.json();
      return NextResponse.json(
        { user: { uid: user.uid, email: user.email, ...registeredUser }, token },
        {
          headers: {
            'Set-Cookie': `token=${token}; Path=/; Max-Age=3600; SameSite=Strict; Secure`,
          },
        }
      );
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API /auth error:', error.message);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 401 });
  }
}