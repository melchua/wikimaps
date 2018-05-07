"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/users", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        console.log('RESULTS',results);
        res.json(results);
    });

  });


// hack to get user
  router.get("/gimmeuser", (req, res) => {
    knex
      .select("*")
      .from("users")
      .where({id: res.locals.user.id})
      .then((results) => {
        res.json(results);
    });

  });


  return router;
}
