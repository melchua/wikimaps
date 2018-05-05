"use strict";

module.exports = function makeMapActions(knex) {

    // map_actions.js:  define promises for getters and setters

    // add helpers
    // delay resolveswith a promise of a value after 2 seconds)
    const delay = (() => {
      return new Promise((res, rej) => {setTimeout(res,2000);});
    });

    const nodelay = (() => {
      return new Promise(res => {res();});
    });

    const unreliable = (() => {
      return new Promise((res, rej) => {
        if (Math.random() < 0.2) {
          res("hot damn, y'all");
        } else {
          rej();
        }
      });
    });

    function getMaps(){
      return delay()
        .then(() => maps);
    }

    /*--------------------------Getters----------------------------------------------*/

    // (mapId:Number) => Promise<Map> returning a promise of a map based on id
    function getMap(id) {
      return delay()
              .then(()=>{
                const foundMapById = maps.find( (map) => {
                return map.id === id;
              });
              return foundMapById;
            });
    } // When the API is ready we will need to replace with something like:
    /*
      return $.getJSON(`/api/maps/${mapId}`)
    */

    // (placeId:Number) => Promise<Place obj>
    function getPlace(id) {
      return delay()
              .then( () => {
                const foundPlaceById = places.find( (place) => {
                  return place.id === id;
                });
                return foundPlaceById;
              });
    }
    /*
      return $.getJSON(`/api/maps/${mapId}/places/${placeId}`)
    */

    /*--------------------------- Setters----------------------------------------------*/


    // when a place gets created, it also gets added to the map as we have a mapid
    // (placeId:Number, mapId:Number, coords:Object({lat,long}), description:text, image:String) => Promise<Place>
    function createPlace(id, mapId, coordinates, description, image, name, flat, draggable) {
      return delay()
              .then( () => {
                const placeObj = {
                  id: id,
                  mapId: mapId,
                  coordinates: coordinates,
                  description: description,
                  image: image,
                  name: name,
                  flat: flat,
                  draggable: draggable
                };
                return placeObj;
              });
    }

    //**********************/
    // ** Edit Places not complete ** /
    // // (placeId:Number, coords:Object({lat,long}), description:text, image:String) => Promise<Place>
    // function editPlace() {
    //   return delay()
    //           .then( () => {

    //           });
    // }


    //  Create Map: add name and Save map
    // (mapID:Number, name:String, user:Number) =>
    function addTitleAndSaveMap(id, name, user_id, coordinates, zoom) {
      return delay()
          .then(() => {
            const newMap =
            {
              id: id,
              name: name,
              created_by: user_id,
              coordinates: coordinates,
              zoom: zoom
            };
            return newMap;
          });
      }

    // (placeId:Number) => Promise<placeId>  return place ID if successful
    function deletePlaceAngry(id) {  // if we cannot find the place of this id, get angry
      return delay()
        .then(() => {
          let index = places.findIndex((element) => element.id === id);
          if (index === -1) {
            throw new Error("oh god not the bees");
          }
          places.splice(index, 1);
        });
    }



    return {
      getMap,
      getMaps,
      deletePlaceAngry
    };
};


/*--------------------------------Test data-------------------------------------------*/

// maps will be an array of objects

const places = [
  {
    id: 1,
    name: "Jonathan's spot",
    description: "Good warm from burning tires nearby. Definitely recommend",
    coordinates:
      {
        lat: 302.3423,
        long: 314.7678
      },
    flat: false,
    draggable: true,
    mapId: 1,
    image: "http://www.hobosrus.com/jonspot.png"
  },
  {
    id: 2,
    name: "Shelter from the storm",
    description: "There's a bit of an awning we could use to sleep under during rainy days",
    coordinates:
      {
        lat: 123.3423,
        long: 314.7678
      },
    flat: false,
    draggable: true,
    mapId: 1,
    image: "http://www.hobosrus.com/jonspot.png"
  }

];

const maps = [
  {
    id: 1,
    name: "Best Hobo Tenting Spots",
    coordinates:
      {
        lat: 123,
        long: 345
      },
    date_updated: '2018-03-05',
    created_by: 1,
    zoom: 14
  },
  {
    id: 2,
    name: "Cheap eats",
    coordinates:
      {
        lat: 123,
        long: 345
      },
    date_updated: '2018-03-05',
    created_by: 2,
    zoom: 14
  }
];






/* -----------------------------------Testing---------------------------------*/
