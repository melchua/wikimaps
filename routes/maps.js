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

  router.route('/:key/places')
    .get((req, res) => {
      mapActions.getPlacesByMapKey(req.params.key)
        .then((places) => {
          res.json(places);
        });
    })
    .post((req, res) => {
      console.log(req.body);
      mapActions.createPlaceWithMapKey(req.params.key, res.locals.user.id, req.body)
        .then((place) => {
          res.status(201).json(place);
        });
    });
  router.post("/places", (req, res) => {

    const newPlace = {
      name: req.body.name,
      description: req.body.description,
      img: req.body.img,
      lat: req.body.lat,
      lng: req.body.lng,
      // map_id: req.body.map_id
    };

    mapActions.createPlace(newPlace)
      .then((place) => {
        res.json(place);
      });
  });


  router.post("/map", (req, res) => {
    console.log('id post success');

    const newMap = {
      name: req.body.name,
      lat: req.body.lat,
      lng: req.body.lng,
      zoom: req.body.zoom,
      user_id: req.session.id
    };

    var mapId = mapActions.createMap(newMap);
    console.log("post mapid", mapId);
    res.send(mapId);

  });


  router.post("/:key", (req, res) => {
    console.log('Adding map title post');
    console.log('these are the things: ', req.body.name, req.params.key, req.body.latitude, req.body.longitude, req.body.zoom)
    mapActions.addMapTitle(req.body.name, req.params.key, req.body.latitude, req.body.longitude, req.body.zoom)
      .then((map) => {
        res.status(201);
      });

  });

  return router;
};
