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

// function getEvents() {
//   connection.connect(function(err) {
//     if (err) throw err;
//     console.log('Connected!');
//     var sql = "USE Upcoming_Events"
//     connection.query(sql, function(err, result) {
//       if (err) throw err;
//     });
//     var sql = "SELECT * FROM Events"
//     connection.query(sql, function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       return(result);
//     });
//   connection.end();
//   })
// }


app.use(cors());

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/events', function (req, res) {

  const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');

    var sql = "USE Upcoming_Events"
    connection.query(sql, function(err, result) {
      if (err) throw err;
    });

    var sql = "SELECT * FROM Events"
    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });

    connection.end();
  })

});
