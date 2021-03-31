const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const path = require("path");
require("dotenv").config();
const Project = require("./models/Project");

const PORT = process.env.PORT || 5000;

const app = express();

const MONGODB = process.env.MONGODB_URL;

app.use(cors({ origin: "*" }));

app.use(express.json());

/* app.use("/src", express.static(path.resolve(__dirname, "client", "src"))); */

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

app.get("/data", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).send({ projects });
  } catch (err) {
    res.status(401).send({ msg: err.message });
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
/* app.get("/", async (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
}); */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// connect to MongoDB
mongoose
  .connect(MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to database"));

// Express server listening
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
