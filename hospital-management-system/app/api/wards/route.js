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