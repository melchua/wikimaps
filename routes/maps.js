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
    // console.log('maps post success');

    const newPlace = {
      name: req.body.name,
      description: req.body.description,
      img: req.body.img,
      lat: req.body.lat,
      lng: req.body.lng,
      map_id: req.body.map_id
    };

    mapActions.createPlace(newPlace)
      .then((place) => {
        res.json(place);
      });
    // console.log("post ajax", newPlace.map_id);
    // res.send('1');

  });



  router.post("/map", (req, res) => {
    console.log('creat map post success');

    const newMap = {
      name: req.body.name,
      lat: req.body.lat,
      lng: req.body.lng,
      zoom: req.body.zoom
    };
    let user_id = 1;
    // var mapId = mapActions.createMap(newMap);
    // console.log("post mapid", mapId);
    // res.send(mapId);
    mapActions.createMap(newMap,user_id)
      .then((mapId) => {
        console.log("post mapid", mapId);
        res.send(mapId);
      });
  });

  router.post("/chris", (req, res) => {
    console.log('TITLE post success');

    const newMapTitle = {
      name: req.body.name
    };

    var mapId = mapActions.addMapTitle(newMapTitle);
    console.log("CHECK TITLE" , newMapTitle.name);
    res.send(mapId);

  });




  return router;
};
