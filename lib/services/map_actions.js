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

    function getMapByKey(key){
      return knex('maps')
        .first('*')
        .where({map_key: key});
    }

    function getOrCreateMapByKey(key, userId){
      return getMapByKey(key)
        .then((map) => {
          // If a map is found by that key, return it.
          if(map) {
            return map;
          }

          // Otherwise, create a new map record and return that.
          return knex('maps')
            .insert({map_key: key, user_id: userId})
            .returning('*')
            .then((records) => records[0]);
        });
    }

    // async function getOrCreateMapByKey(key, userId){
    //   const map = await getMapByKey(key);
    //   if(map !== undefined){
    //     return map;
    //   }

    //   const createdMapArray = await knex('maps')
    //     .insert({map_key, user_id, userId})
    //     .returning('*');

    //   return createdMapArray[0];
    // }


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

    function getPlacesByMapKey(mapKey){
      return knex.select('places.*')
        .from('places')
        .innerJoin('maps', 'maps.id', 'places.map_id')
        .where('maps.map_key', mapKey);
    }

    function createPlaceWithMapKey(mapKey, userId, {name, description, img, lat, lng}){
      const mapPromise = getOrCreateMapByKey(mapKey, userId);
      return mapPromise
        .then((map) => {
          return knex('places')
            .insert({
              name: name,
              description: description,
              latitude: lat,
              longitude: lng,
              map_id: map.id,
              image: img
            })
            .returning('*')
            .then((records) => records[0]);
        });
    }

    // async function createPlaceWithMapKey(mapKey, userId, place){
    //   const map = await getOrCreateMapByKey(mapKey, userId);

    //   place.map_id = map.id;

    //   const insertedRecords = await knex('places')
    //     .insert(place)
    //     .returning('*');

    //   return insertedRecords[0];
    // }
    function getPlacesByMapId(mapId, callback){
      knex.select("*").from("places")
       .where("map_id",mapId)
       .then(function (maps) {
          callback(maps);
          // maps.forEach(function(value){
          //   console.log(value);
      });
    }
    // when a place gets created, it also gets added to the map as we have a mapid
    // (placeId:Number, mapId:Number, coords:Object({lat,long}), description:text, image:String) => Promise<Place>
    function createPlace(savedMarker) {

      console.log('map actions create place');
      console.log(savedMarker);
      return knex('places').insert({

         name: savedMarker.name,
          description: savedMarker.description,
          latitude: savedMarker.lat,
          longitude: savedMarker.lng,
          image: savedMarker.img,
          map_id: 1
      }).returning('*')
        .then((result) => {

          console.log("inserted");
          console.log(result);
          return result[0];
      });

    }

    function createMap(savedMap) {
      var mapId;
      console.log(savedMap);
      knex('maps').insert({
         name: savedMap.name,
          latitude: savedMap.lat,
          longitude: savedMap.lng,
          zoom: savedMap.zoom,
          user_id: 1
      }).returning('id')
        .then((result) => {
          console.log("inserted map");
          console.log(result);
          mapId = result;
          return result;
      });
        console.log("Map Id return", mapId);
      return mapId;
    }

// ***** FIX TOMORROW add primary key from maps to places
    // async function addMapTitle(name, map_key, latitude, longitude, zoom, userId) {
    //   // const map = await getOrCreateMapByKey(map_key, userId);
      // map.name = name;
      // if(latitude) {
      //   map.latitude = latitude;
      // }
      // await knex('maps')
      //   .update(map)
      //   .where({id: map.id});
      // return map
    function addMapTitle(name, map_key, latitude, longitude, zoom, userId) {
      return getOrCreateMapByKey(map_key, userId)
        .then((map) => {
          const updateValues = {};
          if(name){
            updateValues.name = name;
          }
          if(latitude) {
            updateValues.latitude = latitude;
          }
          if(longitude){
            updateValues.longitude = longitude;
          }
          if(zoom){
            updateValues.zoom = zoom;
          }
          return knex('maps')
            .update(updateValues)
            .where({id: map.id})
            .then(() => {return map; });

        });

          // console.log(name);
          // console.log('What we are sending:', name, map_key, latitude, longitude, zoom);
          // knex('maps').insert({
          //   name: name,
          //   latitude: latitude,
          //   longitude: longitude,
          //   zoom: zoom,
          //   user_id: 3
          // }).where({ map_key: map_key})
          //   .returning('*')
          //   .then((result) => {
          //     console.log("Saved the title");
          //     console.log(result);
          // });
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
    // function addTitleAndSaveMap(id, name, user_id, coordinates, zoom) {
    //   return delay()
    //       .then(() => {
    //         const newMap =
    //         {
    //           id: id,
    //           name: name,
    //           created_by: user_id,
    //           coordinates: coordinates,
    //           zoom: zoom
    //         };
    //         return newMap;
    //       });
    //   }

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
      getMapByKey,
      getOrCreateMapByKey,
      getPlacesByMapKey,
      createPlaceWithMapKey,
      deletePlaceAngry,
      createPlace,
      getPlacesByMapId,
      createMap,
      addMapTitle
    };
};


/*--------------------------------Test data-------------------------------------------*/

// maps will be an array of objects

// const places = [
//   {
//     id: 1,
//     name: "Jonathan's spot",
//     description: "Good warm from burning tires nearby. Definitely recommend",
//     coordinates:
//       {
//         lat: 302.3423,
//         long: 314.7678
//       },
//     flat: false,
//     draggable: true,
//     mapId: 1,
//     image: "http://www.hobosrus.com/jonspot.png"
//   },
//   {
//     id: 2,
//     name: "Shelter from the storm",
//     description: "There's a bit of an awning we could use to sleep under during rainy days",
//     coordinates:
//       {
//         lat: 123.3423,
//         long: 314.7678
//       },
//     flat: false,
//     draggable: true,
//     mapId: 1,
//     image: "http://www.hobosrus.com/jonspot.png"
//   }

// ];

// const maps = [
//   {
//     id: 1,
//     name: "Best Hobo Tenting Spots",
//     coordinates:
//       {
//         lat: 123,
//         long: 345
//       },
//     date_updated: '2018-03-05',
//     created_by: 1,
//     zoom: 14
//   },
//   {
//     id: 2,
//     name: "Cheap eats",
//     coordinates:
//       {
//         lat: 123,
//         long: 345
//       },
//     date_updated: '2018-03-05',
//     created_by: 2,
//     zoom: 14
//   }
// ];






/* -----------------------------------Testing---------------------------------*/
