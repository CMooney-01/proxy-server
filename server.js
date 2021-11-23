require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to Database!');
})

connection.end();

app.use(cors());

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/events', (req, res) => {
  res.send({express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'})
});
