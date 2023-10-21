const mongoose = require("mongoose");

const dbService = {};
// Creata A Function That Connects to MongoDb

dbService.connectToDatabase = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  // Connect To Database
  // TODO: What does this mean
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    const connection = await mongoose.connect(databaseUrl, connectionParams);
    console.log(`Connected to ${process.env.APP_NAME} database.`);
  } catch (error) {
    console.error(
      `Error connecting to ${process.env.APP_NAME} database. ${err}`
    );
  }
};

// export { connectToDatabase };
module.exports = dbService;
