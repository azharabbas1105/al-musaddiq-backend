const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");


const dbConfig = require("./app/config/db.config");

const app = express();
const corsOptions = {
  origin: '*', // Update this with the actual origin of your frontend
  credentials: true,
};

app.use(cors(corsOptions))



// app.use(cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Authorization, If-Modified-Since, Cache-control, Pragma, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers',
    )
   next();
});
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "cookie-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to al-musaddiq application." });
});

const routes = require("./app/routes")
app.use("/api",routes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
