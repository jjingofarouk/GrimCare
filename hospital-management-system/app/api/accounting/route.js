import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { costCenter: true },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const transaction = await prisma.transaction.create({ data });
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

// Additional endpoints for other models
export async function GET_PAYROLL() {
  try {
    const payrolls = await prisma.payroll.findMany({ include: { user: true } });
    return NextResponse.json(payrolls);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payrolls' }, { status: 500 });
  }
}

export async function POST_PAYROLL(request) {
  try {
    const data = await request.json();
    const payroll = await prisma.payroll.create({ data });
    return NextResponse.json(payroll, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payroll' }, { status: 500 });
  }
}

export async function GET_ASSETS() {
  try {
    const assets = await prisma.fixedAsset.findMany();
    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST_ASSET(request) {
  try {
    const data = await request.json();
    const asset = await prisma.fixedAsset.create({ data });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}