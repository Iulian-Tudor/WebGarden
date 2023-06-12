import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'garden';

export async function connectToDb() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  return { db, client };
}
