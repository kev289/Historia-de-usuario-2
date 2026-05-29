import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import { User } from '@/models/User';
import { IUser } from '@/interfaces/user.interface';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const { nombre, cc, email, role, password }: Partial<IUser> = body;

    const updateData: Partial<IUser> = {};
    if (nombre) updateData.nombre = nombre;
    if (cc) updateData.cc = cc;
    if (email) updateData.email = email.toLowerCase().trim();
    if (role) updateData.role = role;
    if (password) updateData.password = password; // FASE 1: Texto plano

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error en PUT /api/users/[id]:', error);
    return NextResponse.json({ success: false, message: 'Error al actualizar el usuario.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Usuario eliminado correctamente.' }, { status: 200 });
  } catch (error) {
    console.error('Error en DELETE /api/users/[id]:', error);
    return NextResponse.json({ success: false, message: 'Error al eliminar el usuario.' }, { status: 500 });
  }
}