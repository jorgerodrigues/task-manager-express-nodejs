const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  userNewUrlParser: true,
  useCreateIndex: true,
});
