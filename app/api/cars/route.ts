import { NextResponse } from 'next/server';
import { ticketsDB } from '@/lib/couchdb';

export async function GET() {
  try {
    const result = await ticketsDB.list({ include_docs: true });
    const cars = result.rows.map((row: any) => row.doc);

    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load cars data' }, { status: 500 });
  }
}