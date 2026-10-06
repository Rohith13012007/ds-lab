const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ds_lab_db';
    const conn = await mongoose.connect(connStr);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[DATABASE ERROR] Error connecting to MongoDB: ${error.message}`);
    // Do not terminate process in dev mode if database server is starting
  }
};

module.exports = connectDB;
