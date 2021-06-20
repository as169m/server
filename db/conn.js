const Mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" })
Mongoose.connect(process.env.MongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("connected"))
    .catch(err => console.log(err));