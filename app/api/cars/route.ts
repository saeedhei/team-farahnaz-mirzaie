import { NextResponse } from 'next/server';
import { ticketsDB } from '../../lib/couchdb';

// 1. خواندن لیست ماشین ها (Read)
export async function GET() {
  try {
    const result = await ticketsDB.list({ include_docs: true });
    const cars = result.rows.map((row: any) => row.doc);
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load cars data' }, { status: 500 });
  }
}

// 2. ثبت ماشین جدید (Create)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await ticketsDB.insert(body);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}