import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import { User } from '@/models/User';
import { UserSession } from '@/interfaces/user.interface';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email y contraseña requeridos.' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Email o contraseña incorrectos.' }, { status: 401 });
    }

    // FASE 1: Comparación directa en texto plano
    const isPasswordCorrect = password === user.password;

    if (!isPasswordCorrect) {
      return NextResponse.json({ success: false, message: 'Email o contraseña incorrectos.' }, { status: 401 });
    }

    const userSession: UserSession = {
      id: user._id.toString(),
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ success: true, user: userSession }, { status: 200 });
  } catch (error) {
    console.error('Error en POST /api/auth/login:', error);
    return NextResponse.json({ success: false, message: 'Error en el servidor.' }, { status: 500 });
  }
}