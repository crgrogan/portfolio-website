const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/public", express.static(path.resolve(__dirname, "client", "public"))); //make public static

const transporter = nodemailer.createTransport({
  host: "smtp.live.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

app.post("/send", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, (err, fields) => {
    console.log(fields);
    Object.keys(fields).forEach((property) => {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const mail = {
      sender: `${data.name} <${data.email}>`,
      to: process.env.EMAIL, // receiver email
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: "Something went wrong. Please try again.",
        });
      } else {
        res.status(200).send({ message: "Email sent successfully." });
      }
    });
  });
});

//Index page (static HTML)
app.route("/").get((req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
