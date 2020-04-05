jest.setTimeout(30000);

require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.log("Error :", err.message);
    return;
  }
  console.log("Successfuly connected to the mongoose  db!");
});