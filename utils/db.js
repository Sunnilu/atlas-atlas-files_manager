// utils/db.js

import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Retrieve environment variables with fallback to defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // Connection URI for MongoDB
    const uri = `mongodb://${host}:${port}/${database}`;
    
    // Create a MongoDB client
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Database name (just to use later in functions)
    this.database = database;

    // Connect to the MongoDB server
    this.client.connect()
      .then(() => {
        console.log(`Connected to MongoDB at ${host}:${port}/${database}`);
      })
      .catch((err) => {
        console.error(`Error connecting to MongoDB: ${err}`);
      });
  }

  // Check if the connection to MongoDB is alive
  isAlive() {
    return this.client.isConnected();
  }

  // Get the number of users in the users collection
  async nbUsers() {
    try {
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (err) {
      console.error(`Error fetching users count: ${err}`);
      throw err;
    }
  }

  // Get the number of files in the files collection
  async nbFiles() {
    try {
      const db = this.client.db(this.database);
      const filesCollection = db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (err) {
      console.error(`Error fetching files count: ${err}`);
      throw err;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
