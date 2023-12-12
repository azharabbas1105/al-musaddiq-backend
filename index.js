const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");


const dbConfig = require("./app/config/db.config");

const app = express();

// app.use(cors());
// const corsOptions = {
//   origin: 'https://al-musaddiq.cyclic.app',  // Replace with your allowed origin
//   optionsSuccessStatus: 200    // some legacy browsers (IE11, various SmartTVs) choke on 204
// };


// const corsOpts = {
//   origin: '*',

//   methods: [
//     'GET',
//     'POST',
//     'PUT',
//     'DELETE',
//   ],

//   allowedHeaders: [
//     'Content-Type',
//   ],
// };

// app.use(cors(corsOpts));

// app.use(cors({
//   origin: ['http://localhost:4200'],
//   "methods": "PUT,GET,POST,DELETE",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204,
//   credentials: true
// }));
// app.options('*', cors());
// app.use(function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin: *");
//   res.setHeader("Access-Control-Allow-Methods: PUT,GET,POST,DELETE");
//   res.setHeader("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

/* for Angular Client (withCredentials) */
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

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

// routes
// require("./app/routes/auth.routes")(app);
// require("./app/routes/user.routes")(app);

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
