import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const instruments = await prisma.cssdInstrument.findMany();
    return NextResponse.json(instruments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const instrument = await prisma.cssdInstrument.create({
      data: {
        name: data.name,
        serialNumber: data.serialNumber,
        type: data.type,
        status: data.status || 'AVAILABLE',
        lastSterilized: data.lastSterilized ? new Date(data.lastSterilized) : null,
        location: data.location,
        stockQuantity: parseInt(data.stockQuantity) || 1,
        minStockThreshold: parseInt(data.minStockThreshold) || 1,
      },
    });
    await prisma.cssdLog.create({
      data: {
        instrumentId: instrument.id,
        action: 'CREATED',
        details: `Instrument ${data.name} created`,
        performedBy: data.userId || 1, // Replace with actual user ID from auth
      },
    });
    return NextResponse.json(instrument, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create instrument' }, { status: 500 });
  }
}