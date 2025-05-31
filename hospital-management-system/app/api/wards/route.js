import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const wards = await prisma.ward.findMany();
    return NextResponse.json(wards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wards' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const ward = await prisma.ward.create({
      data: {
        name: data.name,
        totalBeds: data.totalBeds,
        occupiedBeds: data.occupiedBeds || 0,
        department: data.department || null,
      },
    });
    return NextResponse.json(ward, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ward' }, { status: 500 });
  }
}