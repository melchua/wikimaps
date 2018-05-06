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

  router.get("/:id", (req, res) => {
    mapActions.getPlacesByMapId(req.params.id, function(result){
      res.json({data: result});
    });
   });

    // mapActions.getMaps()
    //   .then((maps) => {
    //     res.json(maps);

    //   });



  router.post("/places", (req, res) => {
    console.log('maps post success');

    const newPlace = {
      name: req.body.name,
      description: req.body.description,
      img: req.body.img,
      lat: req.body.lat,
      lng: req.body.lng,
      // map_id: req.body.map_id
    };

    mapActions.createPlace(newPlace);
    // console.log("post ajax", newPlace.map_id);
    res.send('1');

  });



  return router;
};
