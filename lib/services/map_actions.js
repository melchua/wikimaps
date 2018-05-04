// map_actions.js:  define promises for getters and setters
// points and places are interchangeable

// add helpers
// delay resolveswith a promise of a value after 2 seconds)
const delay = (() => {
  return new Promise(res => {setTimeout(res,2000);});
});


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

// (pointId:Number) => Promise<Point obj>
function getPoint(id) {
  return delay()
          .then( () => {
            const foundPointById = maps.find( (map) => {
              return point.id === id;
            });
            return foundPointById;
          });
}


/*--------------------------- Setters----------------------------------------------*/

// (pointId:Number, mapId:Number, coords:Object({lat,long}), description:text, image:String) => Promise<Point>
function createPoint() {
}

//  add title and Save map
// (mapID:Number, titleId:Number, user:Number) =>
function addTitleAndSaveMap() {
}

// (pointId:Number) => Promise<pointId>  return point ID if successful
function deletePoint() {
}


/*--------------------------------Test data-------------------------------------------*/

// maps will be an array of objects

const point = [
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
    mapId: 2,
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
    date_updated: 2018-03-05,
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
    date_updated: 2018-03-05,
    created_by: 2,
    zoom: 14
  }
];

// testing getMap

getMap(2)
  .then((myMap) => {
    console.log(myMap);
  });

