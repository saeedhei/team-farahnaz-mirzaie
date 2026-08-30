import { cars_db } from './couchdb';
import carsData from '../cars.json';

export async function seedDatabase() {
  try {
    for (const car of carsData) {
      try {
        await cars_db.insert(car);
        console.log(Car inserted: ${car.title});
      } catch (err: any) {
        if (err.statusCode !== 409) {
          console.error(Failed to insert car ${car.title}:, err.message);
        }
      }
    }
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
seedDatabase();
