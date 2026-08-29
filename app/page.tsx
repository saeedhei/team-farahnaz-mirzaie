import Image from 'next/image';

// تابعی برای گرفتن اطلاعات ماشین‌ها از API که ساختید
async function getCars() {
  try {
    // اگر روی لوکال‌هاست هستید یا مسیر نسبی
    const res = await fetch('http://localhost:3000/api/cars', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch cars');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const carsData = await getCars();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
          Luxury & Sports Car Gallery
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carsData.map((car: any) => (
            <div
              key={car._id || car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={car.image}
                  alt={car.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{car.title}</h2>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{car.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
