const mongoose = require('mongoose');

module.exports = async function connection() {
  mongoose
    .connect(
      process.env.MONGODB_URL ||
        'mongodb+srv://administrator:administrator@chatdb.oyaqd.mongodb.net/chatdb?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .catch((err) => console.log(err));

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
  });
};
