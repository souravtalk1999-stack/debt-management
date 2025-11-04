import { NextResponse } from 'next/server';
import { db, loans } from '@/src/db';

export async function GET() {
  try {
    const allLoans = db.select().from(loans).all();
    return NextResponse.json(allLoans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLoan = db.insert(loans).values(body).returning().get();
    return NextResponse.json(newLoan, { status: 201 });
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json({ error: 'Failed to create loan' }, { status: 500 });
  }
}
