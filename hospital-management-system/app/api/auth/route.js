import { NextResponse } from 'next/server';
   import { registerUser, loginUser } from '@lib/auth';

   export async function POST(request) {
     try {
       const { action, email, password, name, role } = await request.json();
       console.log(`API /auth: action=${action}, email=${email}`);
       if (action === 'register') {
         const result = await registerUser({ email, password, name, role });
         return NextResponse.json(result, { status: 201 });
       } else if (action === 'login') {
         const result = await loginUser({ email, password });
         return NextResponse.json(result, { status: 200 });
       }
       return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
     } catch (error) {
       console.error(`API /auth error: ${error.message}`);
       return NextResponse.json({ error: error.message }, { status: 400 });
     }
   }
   
   console.log('JWT_SECRET:', process.env.JWT_SECRET);