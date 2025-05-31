import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stats = {
      totalTransactions: await prisma.transaction.count(),
      pendingTransactions: await prisma.transaction.count({
        where: { status: 'PENDING' },
      }),
      totalRevenue: await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { category: 'INCOME' },
      }),
      chartData: await prisma.transaction.groupBy({
        by: ['date'],
        _sum: { amount: true },
        where: { category: 'INCOME' },
        orderBy: { date: 'asc' },
        take: 30, // Last 30 days
      }),
    };

    // Format chart data for Chart.js
    const formattedChartData = {
      labels: stats.chartData.map(item =>
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Revenue',
          data: stats.chartData.map(item => item._sum.amount || 0),
          borderColor: '#4c51bf',
          backgroundColor: 'rgba(76, 81, 191, 0.2)',
          fill: true,
        },
      ],
    };

    return NextResponse.json({
      totalTransactions: stats.totalTransactions,
      pendingTransactions: stats.pendingTransactions,
      totalRevenue: stats.totalRevenue._sum.amount || 0,
      chartData: formattedChartData,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}