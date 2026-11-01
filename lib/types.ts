export interface Car {
  _id?: string;
  _rev?: string;
  id?: string; // این رو نگه می‌داریم تا خطای فایل‌های دیگه رفع بشه
  title: string;
  description: string;
  image: string;
}

export type CouchDocument = Car | null;
