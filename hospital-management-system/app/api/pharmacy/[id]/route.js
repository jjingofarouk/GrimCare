// app/api/pharmacy/[id]/route.js
// API routes for individual medication operations

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const medication = await prisma.medication.findUnique({
      where: { id: parseInt(params.id) },
      include: { supplier: true, formulary: true },
    });
    if (!medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }
    return NextResponse.json(medication);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medication' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const medication = await prisma.medication.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(medication);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update medication' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.medication.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Medication deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete medication' }, { status: 500 });
  }
}