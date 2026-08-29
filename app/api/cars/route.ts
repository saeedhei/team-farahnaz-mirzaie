import { NextResponse } from 'next/server';
import { cars_db, couch } from '../../lib/couchdb';

// 1. خواندن لیست ماشین‌ها (Read)
export async function GET() {
  try {
    const result = await cars_db.list({ include_docs: true });
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
    const response = await cars_db.insert(body);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}

// 3. ویرایش ماشین (Update)
export async function PUT(request: Request) {
  try {
    const body = await request.json(); // باید شامل _id و _rev و اطلاعات جدید باشد
    const response = await cars_db.insert(body);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

// 4. حذف ماشین (Delete)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const rev = searchParams.get('rev');

    if (!id || !rev) {
      return NextResponse.json({ error: 'ID and Rev are required' }, { status: 400 });
    }

    const response = await cars_db.destroy(id, rev);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}