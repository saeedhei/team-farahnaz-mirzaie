import { NextResponse } from 'next/server';
import { cars_db, couchReady } from '../../lib/couchdb';
import { Car, CouchDocument } from '@/lib/types';

// ۱. دریافت ماشین‌ها (Get)
export async function GET(request: Request) {
  try {
    await couchReady;

    // خواندن شماره صفحه و تعداد از آدرس (URL)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const skip = (page - 1) * limit;

    // گرفتن همه اطلاعات از دیتابیس
    const result = await cars_db.list({ include_docs: true });
    const allCars = result.rows
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((row: any) => row.doc as CouchDocument)
      .filter((doc): doc is Car => doc !== null && doc !== undefined);

    // برش دادن لیست (فقط ماشین‌های مربوط به این صفحه)
    const totalCars = allCars.length;
    const paginatedCars = allCars.slice(skip, skip + limit);

    // برگرداندن جواب به همراه تعداد کل صفحات
    return NextResponse.json({
      cars: paginatedCars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: page,
      totalCars,
    });
  } catch (error) {
    console.error('GET /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to load cars data' }, { status: 500 });
  }
}

// ۲. ثبت ماشین جدید (Post)
export async function POST(request: Request) {
  try {
    await couchReady;
    const body = (await request.json()) as Car;

    // ثبت در دیتابیس
    const response = await cars_db.insert(body);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('POST /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}

// ۳. ویرایش ماشین (Update)
export async function PUT(request: Request) {
  try {
    await couchReady;
    const body = (await request.json()) as Car;

    if (!body._id || !body._rev) {
      return NextResponse.json({ error: '_id and _rev are required' }, { status: 400 });
    }

    const response = await cars_db.insert(body);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('PUT /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

// ۴. حذف ماشین (Delete)
export async function DELETE(request: Request) {
  try {
    await couchReady;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const rev = searchParams.get('rev');

    if (!id || !rev) {
      return NextResponse.json({ error: 'ID and Rev are required' }, { status: 400 });
    }

    const response = await cars_db.destroy(id, rev);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('DELETE /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
