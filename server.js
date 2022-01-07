require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"));
const cors = require('cors');
const port = process.env.PORT || 5000;
const mysql = require('mysql');
const stripe = require('stripe')('sk_test_51K50drLJQcpU2qlqFdNM52tcYNHyP21Ee2Pj991UKzzJjgS4M75eeQBGWKnowaG6zQpgYgI1zN40fhYJHQnQIYKz00RTIQU0ev');

// Stripe setup

app.post("/create-payment-intent", async (req, res) => {

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 6500,
    currency: 'aud',
    payment_method_types: ['card'],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// End Stripe setup

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

    var sql = "SELECT *, DATE_FORMAT(event_date, '%a the %D of %b, %Y') as NewDateField FROM Events"

    connection.query(sql, function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });

    connection.end();
  })

});

// app.get('/payment', function (req, res) {
//
//   const connection = mysql.createConnection({
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT
//   });
//
//   connection.connect(function(err) {
//     if (err) throw err;
//     console.log('Payments route');
//
//     // Need to check if database for comp entries currently exists
//     // If not, need to create one
//     // If exists, need to add user data to datbase table
//
//     // connection.query(`
//     //   SELECT COUNT(*)
//     //   FROM information_schema.tables
//     //   WHERE table_schema = "Upcoming_Events"
//     //   AND table_name = "Entries1"
//     //   `, function(err, result) {
//     //   if (err) throw err;
//     //   console.log(result);
//     //   res.send(result);
//     // });
//
//     connection.end();
//   })
// });

app.post('/event-signup', function(req, res) {

  console.log(req.body.comp);

  let compID = parseInt(req.body.comp, 10)
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


        var sql = `
          CREATE TABLE IF NOT EXISTS Entries${compID} (
            entry_id INT NOT NULL AUTO_INCREMENT,
            comp_id INT NOT NULL,
            lifter_name VARCHAR(255) NOT NULL,
            lifter_email VARCHAR(255) NOT NULL,
            lifter_phone VARCHAR(20) NOT NULL,
            lifter_dob DATE NOT NULL,
            PRIMARY KEY (entry_id),
            FOREIGN KEY (comp_id) REFERENCES Events(event_id)
          );
          `

          connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log("Table created");
          });

          var sql = `
            INSERT INTO Entries${compID}
            (comp_id, lifter_name, lifter_email, lifter_phone, lifter_dob)
            VALUES
            ('${compID}', '${lifterName}', '${lifterEmail}', '${lifterPhone}', '${lifterDob}');
          `
          connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log("Lifter info inserted");
          });

      connection.end();
    })

    res.redirect("/payment-success");
});
