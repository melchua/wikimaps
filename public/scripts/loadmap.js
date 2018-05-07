var markerForNew = null;

var markers = [];


// $('document').ready(function(e){
//   // getAndRenderMarkers(1);


function saveData(marker) {
  var $infoBox = $('.savedMarkerInfo');
  $('.savedMarkerInfo').one('click', '.savebutton', function(e){
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var img = document.getElementById('image').value;
    var latlng = marker.getPosition();
    var lat = latlng.lat();
    var lng = latlng.lng();

    var savedMarker = {
      name: name,
      description: description,
      img: img,
      lat: lat,
      lng: lng,
    };

    // console.log('saved marker', savedMarker);

    // console.log('Fool me only ONCE?');

    // Ajax call
    $.ajax({
      url: "/maps/" + mapKey + "/places",
      method: "POST",
      data: savedMarker,
      success: (data) => {
        console.log('success in ajax', data);

        marker.infowindow.close();
        // messagewindow.open(map, marker);
        $infoBox.get(0).reset();
        getAndRenderMarkers(mapKey);     // TODO: is "data.markers" correct? what is correct?  who is bear?
      },
      error: (err) => {
        console.log("Err:", err);
      }
    });
//        infowindow.close();
  });
}


//==);



function getAndRenderMarkers(mapId) {
  console.log("map id",mapId);
  var url = "/maps/"+mapKey + '/places';
  console.log('URL ' ,url);

  $.ajax({
    url: url,
    method: "GET",
    success: (data) => {
      console.log("we are in get /map/id success");
      console.log(data);
      // data = JSON.stringify(data);
      renderMarkers(data, map);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Err:", textStatus);
    }
  });
}

function renderMarkers(markers, map) {
  for (let marker of markers) {
    renderSingleRichMarker(marker, map);
  }
}

function renderSingleRichMarker(markerData, map) {
  var location = new google.maps.LatLng(markerData.latitude,markerData.longitude);

  let marker = new google.maps.Marker({
    position: location,
    flat: false,
    map: map,
    draggable: false
  });

  let infoContent = `
    <div class='savedMarkerInfo'>
      <table>
        <tr><td>Name:</td> <td>${markerData.name}</td> </tr>
        <tr><td>Description:</td> <td>${markerData.description}</td> </tr>
             <tr><td><img src="${markerData.image}" id="simpsontest"></td></tr>
      </table>
    </div>`;

  marker.infowindow = new google.maps.InfoWindow({
    content: infoContent
  });

  google.maps.event.addListener(marker, 'click', function() {
    marker.infowindow.open(map, marker);
  });

}

function initMap() {
  $(function(){


    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 50, lng: -123},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    getAndRenderMarkers(mapKey);
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    // var markers = [];

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        // console.log(markers);

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    //Geolocation section here:
    var infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }


// Tampered code  - Mel

    //User can add marker to a map by clicking on the map. The next point clicked will remove the first point clicked
    google.maps.event.addListener(map, 'click', function(event) {
      console.log("map addlistener on click", map)
      // document.getElementById('createButton').onclick = function() {
      // console.log("map addlistener  iiii on click", map)
        //alert("button was clicked");
      // }​
       addMarker(event.latLng, map);
    });
    function addMarker(location, map) {
      // var lat = location.lat();
      // var lng = location.lng();
      // location = {lat:lat, lng:lng};
      if(markerForNew) {
          markerForNew.setPosition(location);
      } else {
        markerForNew = new google.maps.Marker({
          position: location,
          flat: false,
          map: map,
          draggable: true
        });

        let infoContent = `

        <form class='savedMarkerInfo'>

        <div class='savedMarkerInfo'>
          <table>
            <tr><td>Name:</td> <td><input type='text' id='name' placeholder='Place name'/></td> </tr>
            <tr><td>Description:</td> <td><input type='text' id='description' placeholder='Enter desc'/></td> </tr>
            <tr><td>Image:</td> <td><input type='text' id='image' placeholder='http://image.jpg'/></td> </tr>
            <tr><td></td><td><input type='button' class='savebutton' value='Save' onclick='saveData(markerForNew)'/></td></tr>
          </table>
        </form>`;
        //        <tr><td>Name:</td> <td><input type='text' class='name' value='${markerData.name}'/></td> </tr>
        //        <tr><td></td><td><input type='button' value='Save' onclick='saveData()'/></td></tr>
// onclick='saveData(markerForNew)

        markerForNew.infowindow = new google.maps.InfoWindow({
          content: infoContent
        });


        google.maps.event.addListener(markerForNew, 'click', function() {
          markerForNew.infowindow.open(map, markerForNew);
          // saveData(markerForNew);
        });


      }

    }
  // $('.createButton').click(function(){
  //   console.log(map.getCenter().lng());
  //   console.log(map.getCenter().lat());
  //   console.log(map.getZoom());

  //   // var savedMap = new google.maps.Map(document.getElementById('map'), {
  //   //   center: {lat: map.getCenter().lat(), lng: map.getCenter().lng()},
  //   //   zoom: map.getZoom(),
  //   //   mapTypeId: 'roadmap'
  //   // });

  //   var savedMap = {
  //     name: "name",
  //     lat: map.getCenter().lat(),
  //     lng: map.getCenter().lng(),
  //     zoom: map.getZoom()
  //   };
  //   console.log('saved map', savedMap);

  //   $.ajax({
  //     url: "/maps/map",
  //     method: "POST",
  //     data: savedMap,
  //     // dataType: "json",
  //     success: (data) => {
  //       // data = JSON.parse(data);
  //       console.log('success in mapAjax', data);
  //     },
  //     error: (err) => {
  //       console.log("Err:", err);
  //   }

  //   });
  // });

    $('.saveMapBtn').click(function(){

    var savedTitle = document.getElementById('mapTitle').value;



    var savedMap = {
      name: savedTitle,
      latitude: map.getCenter().lat(),
      longitude: map.getCenter().lng(),
      zoom: map.getZoom()
    };


    console.log("saved Map printout: ", savedMap);


    $.ajax({
      url: "/maps/" + mapKey,
      method: "POST",
      data: savedMap,
      // dataType: "json",
      success: (data) => {
        // data = JSON.parse(data);
        console.log('success in mapAjax', data);
        res.redirect('/');
      },
      error: (err) => {
        console.log("Err:", err);
    }

  });


    });



// Original code
    //User can add marker to a map by clicking on the map. The next point clicked will remove the first point clicked
    // google.maps.event.addListener(map, 'click', function(event) {
    //    addMarker(event.latLng, map);
    // });
    // function addMarker(location, map) {
    //   var lat = location.lat();
    //   var lng = location.lng();
    //   location = {lat:lat, lng:lng};
    //   if (!window.cheat.createFlag) return; // only allow marker creation/movement when in "create mode"
    //   if(markerForNew) {
    //       markerForNew.setPosition(location);
    //   } else {
    //     markerForNew = new google.maps.Marker({
    //       position: location,
    //       flat: false,
    //       map: map,
    //       draggable: true
    //     });
    //   }
    // }
    window.map = map;     // totally unacceptable debugging hack, fixme
    // let totallyFakeMarkerData = [
    //   {
    //     lat: 49.2826,
    //     lng: -123.0,
    //     name: 'So Fake',
    //     description: 'honestly I can see the pixels',
    //     img: 'http://www.avenuecalgary.com/images/cache/cache_9/cache_4/cache_4/CraftBeerFlight-7c82a449.jpeg?ver=1480633356&aspectratio=1.5037593984962'
    //   },
    //   {
    //     lat: 49.3826,
    //     lng: -123.0,
    //     name: 'Real Things',
    //     description: 'my heart is filled with regret',
    //     img: 'https://i.ytimg.com/vi/_wQh8F3kdMQ/maxresdefault.jpg'
    //   },
    //   {
    //     lat: 49.2826,
    //     lng: -123.2,
    //     name: 'Place',
    //     description: 'words about a place',
    //     img: 'data:image/jpeg;base64,/9
    //   },
    // ];
    // renderMarkers(totallyFakeMarkerData, map);



    // // Sets the map on all markers in the array.
    // function setMapOnAll(map) {
    //     marker.setMap(map);
    // }

    // // Removes the markers from the map, but keeps them in the array.
    // function clearMarkers() {
    //  marker.setMap(null);
    // }

    // // Shows any markers currently in the array.
    // function showMarkers() {
    //  marker.setMap(map);
    // }

    // // Deletes all markers in the array by removing references to them.
    // function deleteMarkers() {
    //  clearMarkers();
    // }

  });
}
