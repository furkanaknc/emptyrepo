require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const passport = require("passport");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

require("./config/passport")(passport);

const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connected to db`);
  })
  .catch((err) => {
    console.log(`Unable to connect with the database ${err}`);
  });

app.get("/", (req, res) => {
  return res.send("<h1>Hello World</h1>");
});

const users = require("./routes/api/users");
app.use("/api/users", users);

const humans = require("./routes/api/humans");
app.use("/api/humans", humans);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
