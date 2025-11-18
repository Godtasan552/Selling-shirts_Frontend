
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, you would fetch this data from a database or other service.
  const publicStats = {
    totalStock: 1234,
    totalSold: 567,
  };

  return NextResponse.json(publicStats);
}
