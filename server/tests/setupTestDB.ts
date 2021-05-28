import mongoose from "mongoose";

const clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections);

  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];

    try {
      await collection.drop();
    } catch (error) {
      if (error.message === "ns not found" || error.message.includes("a background operation is currently running")) {
        continue;
      }

      console.log(error.message);
    }
  }
}

export default (dbname: string) => {
  beforeAll(async () => {
    try {
      await mongoose.connect(`mongodb://localhost/${dbname}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });

      await clearDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await clearDatabase();

    await mongoose.connection.close();
  });

  afterEach(async () => {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];

      await collection.deleteMany({});
    }
  });
}
