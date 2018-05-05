"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (mapActions) => {

  router.get("/", (req, res) => {
    mapActions.getMaps()
      .then((maps) => {
        res.json(maps);

      });
  });

  return router;
};
