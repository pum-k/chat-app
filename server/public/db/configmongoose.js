const mongoose = require('mongoose');

module.exports = async function connection() {
  mongoose
    .connect(
      process.env.MONGODB_URL ||
        'mongodb+srv://administrator:administrator@chatdb.oyaqd.mongodb.net/chatdb?retryWrites=true&w=majority',
        // "mongodb://localhost:27017/chat-app",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: true,
      }
    )
    .catch((err) => console.log(err));

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
  });
};
