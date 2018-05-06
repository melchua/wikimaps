"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const cookieSession = require('cookie-session');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
// const mapsRoutes = require("./routes/maps");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
app.use(cookieSession({
  secret: 'I sing Moana tunes in the shower'
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

function getRandomString(){
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const alphabet = letters + letters.toUpperCase() + '0123456789';
  let output = '';
  for(var i = 0; i < 8; i += 1){
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
}
const userActions = require('./lib/services/user_actions')(knex);
const mapActions = require('./lib/services/map_actions')(knex);

app.use((req, res, next) => {
  console.log('Session', req.session);
  userActions.findUserById(req.session.userId)
    .then((user) => {
      res.locals.user = user;
      console.log('User', user);
      next();
    });
});

// Mount all resource routes
app.use("/users", usersRoutes(knex));
app.use('/maps', require('./routes/maps')(mapActions))
// Home page

app.get('/backdoor/:user_id', (req, res) => {
  req.session.userId = Number(req.params.user_id) || 0;
  res.redirect('/');
});
app.get('/', (req, res) => {
  res.redirect('/' + getRandomString());
});
app.get("/:map_key", (req, res) => {
  res.render("index", {mapKey: req.params.map_key});
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
