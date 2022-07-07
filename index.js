/* eslint-disable max-len */
//const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const express = require("express");

const app = express();
// app.get('/app', (request, response) => {
//     response.send(`${Date.now()}`);
// });

// exports.app = functions.https.onRequest(app);

const session = require("express-session");

app.set("view engine", "ejs");

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: "SECRET",
}));

app.get("/", function(req, res) {
  res.render("pages/auth");
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("App listening on port " + port));

const passport = require("passport");
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID = "1016549975563-164bng1jeri8tqt7rhp781t81ahtvoik.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/google/callback",
},
function(accessToken, refreshToken, profile, done) {
  userProfile=accessToken;
  return done(null, userProfile);
}
));

app.get("/auth/google",
    passport.authenticate("google", {scope: ["profile", "email", "https://www.googleapis.com/auth/firebase.messaging"]}));

app.get("/auth/google/callback",
    passport.authenticate("google", {failureRedirect: "/error"}),
    function(req, res) {
    // Successful authentication, redirect success.
      res.redirect("/success");
    });

//xports.app = functions.https.onRequest(app);
