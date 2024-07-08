const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signing = require("./controllers/signing");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "12345",
    database: "master",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("unable to fetch users"));
});

app.post("/signing", (req, res) => {
  signing.handleSigning(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db, bcrypt);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(3004, () => {
  console.log("app is running on port 3004");
});
