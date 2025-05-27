import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const fixedAsset = await prisma.fixedAsset.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!fixedAsset) {
      return NextResponse.json({ error: 'Fixed asset not found' }, { status: 404 });
    }
    return NextResponse.json(fixedAsset);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fixed asset' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const fixedAsset = await prisma.fixedAsset.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(fixedAsset);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update fixed asset' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.fixedAsset.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Fixed asset deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete fixed asset' }, { status: 500 });
  }
}