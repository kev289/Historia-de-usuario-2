import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import { User } from '@/models/User';
import { IUser } from '@/interfaces/user.interface';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function GET() {
  try {
    await connectDB();

    const users: IUser[] = await User.find({}).select('-password');

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/users:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los usuarios.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { nombre, cc, email, password, role }: Omit<IUser, '_id'> = body;

    if (!nombre || !cc || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'El correo electrónico ya está registrado.' },
        { status: 400 }
      );
    }

    const newUser = new User({
      nombre,
      cc,
      email,
      password,
      role
    });

    await newUser.save();

    // Enviar email de bienvenida (no bloquea la respuesta)
    sendWelcomeEmail({ nombre, email, password }).catch((err) =>
      console.error('Error al enviar email de bienvenida:', err)
    );

    const { password: _, ...userCreated } = newUser.toObject();

    return NextResponse.json({ success: true, user: userCreated }, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/users:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear el usuario.' },
      { status: 500 }
    );
  }
}