const mongoose = require('mongoose');

async function connect(uri) {
  if (!uri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose.connection;
}

module.exports = { connect, mongoose };
