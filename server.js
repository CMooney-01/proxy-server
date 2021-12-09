require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
const cors = require('cors');
const port = process.env.PORT || 5000;
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT
});

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

app.get('/payment', function (req, res) {

  const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log('Payments route');

    // Need to check if database for comp entries currently exists
    // If not, need to create one
    // If exists, need to add user data to datbase table

    connection.query(`
      SELECT COUNT(*)
      FROM information_schema.tables
      WHERE table_schema = "Upcoming_Events"
      AND table_name = "Entries1"
      `, function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });

    connection.end();
  })
});

app.post('/event-signup', function(req, res) {

  let lifterName = req.body.lifterName;
  let lifterEmail = req.body.lifterEmail;
  let lifterPhone = req.body.lifterPhone;
  let lifterDob = req.body.lifterDob;

  const connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  });

  connection.connect(function(err) {
      if (err) throw err;
      console.log('Form submission route');

      var sql = "USE Upcoming_Events"
      connection.query(sql, function(err, result) {
        if (err) throw err;
      });

      var sql =`INSERT INTO Entries1 (entry_id, comp_id, lifter_name, lifter_email, lifter_phone, lifter_dob) VALUES
      ("01", "01", "${lifterName}", "${lifterEmail}", "${lifterPhone}", "${lifterDob}")`

      connection.query(sql, function(err, result) {
        if (err) throw err;
        console.log('Lifter info submitted successfully');
      });

      connection.end();
    })

    res.redirect("/payment");
});
