import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Remove deprecated options (useNewUrlParser, useUnifiedTopology)
    // These are default in Mongoose 6+
    console.log("MONGODB_URI =", process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI );

    console.log(`✅ MongoDB холбогдлоо: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB холболтын алдаа: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;