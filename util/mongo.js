async function dbConnect() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGO_URL, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        throw error; // Rethrow to propagate error
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset on failure
    console.error('Failed to establish MongoDB connection:', error.message);
    throw error;
  }
}
