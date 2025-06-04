import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const fixedAssets = await prisma.fixedAsset.findMany();
    return NextResponse.json(fixedAssets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fixed assets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const fixedAsset = await prisma.fixedAsset.create({ data });
    return NextResponse.json(fixedAsset, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create fixed asset' }, { status: 500 });
  }
}