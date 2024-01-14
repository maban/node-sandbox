// External modules

const dotenv = require("dotenv");
const handlebars = require("express-handlebars");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const port = process.env.PORT || "8000";

require("dotenv").config();

const authRouter = require("./auth");

// Session Configuration

app.use(cors());
app.use(express.json());

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
};

if (app.get("env") === "production") {
  session.cookie.secure = true;
}

// Passport Configuration

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);

// App configuration

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "default",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
  })
);

// Connections

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGODB_USERNAME +
      ":" +
      process.env.MONGODB_PASSWORD +
      process.env.MONGODB_URI
  )
  .then(() => {
    console.log("👍 Connected to database");
    app.listen(port, () => {
      console.log(`👍 Running on port ` + port);
    });
  })
  .catch(() => {
    console.log("💩 Database connection failed");
  });

// Router mounting

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use("/", authRouter);

// Public routes

app.get("/", (req, res) => {
  res.render("home");
});

// Secured routes

const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

app.get("/account", secured, (req, res, next) => {
  const { _raw, _json, ...userProfile } = req.user;
  res.render("account", {
    title: "Account",
    userProfile: userProfile,
  });
});
