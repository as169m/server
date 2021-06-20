const express = require('express')
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser")
require('./db/conn')
const User = require('./model/userSchema')
dotenv.config({ path: "./config.env" })
const app = express();
app.use(express.json())
app.use(cookieParser())
const port = process.env.PORT;

app.use(require('./router/auth'))
app.listen(port, () => console.log(`Server running on port ${port} 🔥`));

