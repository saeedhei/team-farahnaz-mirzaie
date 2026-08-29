import nano from 'nano';

if (!process.env.COUCH_URL) {
  throw new Error('COUCH_URL is missing from environment');
}

export const couch = nano(process.env.COUCH_URL);
export const cars_db = couch.db.use('cars_db');