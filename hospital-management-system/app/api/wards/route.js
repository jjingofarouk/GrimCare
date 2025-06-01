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
    if (!data.name || !data.totalBeds || !data.wardNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const ward = await prisma.ward.create({
      data: {
        name: data.name,
        wardNumber: data.wardNumber,
        totalBeds: data.totalBeds,
        occupiedBeds: data.occupiedBeds || 0,
        department: data.department || null,
        location: data.location || null,
        nurseInCharge: data.nurseInCharge || null,
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

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const ward = await prisma.ward.update({
      where: { id: parseInt(params.id) },
      data: {
        name: data.name || undefined,
        wardNumber: data.wardNumber || undefined,
        totalBeds: data.totalBeds || undefined,
        occupiedBeds: data.occupiedBeds || undefined,
        department: data.department || null,
        location: data.location || null,
        nurseInCharge: data.nurseInCharge || null,
      },
    });
    return NextResponse.json(ward);
  } catch (error) {
    console.error('PUT /api/wards/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update ward', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const ward = await prisma.ward.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!ward) {
      return NextResponse.json({ error: 'Ward not found' }, { status: 404 });
    }
    await prisma.ward.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Ward deleted' });
  } catch (error) {
    console.error('DELETE /api/wards/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete ward', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}