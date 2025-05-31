// app/api/wards/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const wards = await prisma.ward.findMany();
    return NextResponse.json(wards);
  } catch (error) {
    console.error('GET /api/wards error:', error);
    return NextResponse.json({ error: 'Failed to fetch wards', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name || !data.totalBeds) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
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
    console.error('POST /api/wards error:', error);
    return NextResponse.json({ error: 'Failed to create ward', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}