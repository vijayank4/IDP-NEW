const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.NODE_APP_PORT;
const ipAddress = process.env.NODE_APP_SERVER_HOST;
const secretKey = process.env.NODE_APP_SECRET_KEY;
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

app.use('/api', apiRoutes);

app.use('/profilepic', express.static(path.join(__dirname, 'profilepic')));

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(port, ipAddress, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Server started on ${ipAddress}:${port}`);
});