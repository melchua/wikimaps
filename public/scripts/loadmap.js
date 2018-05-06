var markerForNew = null;

var markers = [];


$('document').ready(function(e){
  // getAndRenderMarkers(1);

});

function saveData(marker) {
  var $infoBox = $('.savedMarkerInfo');
  $('.savedMarkerInfo').on('click', '.savebutton', function(e){
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

    console.log('saved marker', savedMarker);

    // Ajax call
    $.ajax({

      url: "/maps/places",
      method: "POST",
      data: savedMarker,
      success: (data) => {
        console.log('success in ajax', data);
        marker.infowindow.close();
        // messagewindow.open(map, marker);
        $infoBox.get(0).reset();
        getAndRenderMarkers(data);     // TODO: is "data.markers" correct? what is correct?  who is bear?
      },
      error: (err) => {
        console.log("Err:", err);
    }

  });

});

}

function getAndRenderMarkers(mapId) {
  // var data = {
  //   mapId: mapId
  // };
  console.log("map id",mapId);
  var url = "/maps/"+mapId;
  console.log('URL ' ,url);

  $.ajax({
    url: url,
    method: "GET",
    success: (data) => {
      console.log("we are in success");
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
        // Clear out the old markers.

  console.log('PRIHTING MARKERS: ',markers);
  for (var i = 0; i < markers.length; i++)
  {
    markers[i].setMap(null);
  }
  // markers.forEach(function(marker) {
  //   marker.setMap(null);
  // });

  for (let marker of markers.data) {
    console.log('rendering markers: ',marker);
    renderSingleRichMarker(marker, map);

  }
}

function renderSingleRichMarker(markerData, map) {
  console.log('markerData: ', markerData);
  console.log('map: ', map);

  var location = new google.maps.LatLng(markerData.latitude,markerData.longitude);

  let marker = new google.maps.Marker({
    position: location,
    flat: false,
    map: map,
    draggable: true
  });

  console.log('IMAGE: ', markerData.img);

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

        console.log(markers);

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




    // TODO
    // 1. add marker *
    // 2. marker should have info window attached to save data *
    // 3. add save button *
    // 4. save to array of markers of the map and re-render the markers
    // 5. repeat ability to add marker



// Tampered code  - Mel

    //User can add marker to a map by clicking on the map. The next point clicked will remove the first point clicked
    google.maps.event.addListener(map, 'click', function(event) {
       addMarker(event.latLng, map);
    });
    function addMarker(location, map) {
      // var lat = location.lat();
      // var lng = location.lng();
      // location = {lat:lat, lng:lng};
      if (!window.cheat.createFlag) return; // only allow marker creation/movement when in "create mode"
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
        <link rel="stylesheet" href="/styles/layout.css" type="text/css" />
        <form class='savedMarkerInfo'>
          <table>
            <tr><td>Name:</td> <td><input type='text' id='name' placeholder='Place name'/></td> </tr>
            <tr><td>Description:</td> <td><input type='text' id='description' placeholder='Enter desc'/></td> </tr>
            <tr><td>Image:</td> <td><input type='text' id='image' placeholder='http://image.jpg'/></td> </tr>
            <tr><td></td><td><input type='button' class='savebutton' value='Save' onclick='saveData(markerForNew)'/></td></tr>
          </table>
        </form>`;
        //        <tr><td>Name:</td> <td><input type='text' class='name' value='${markerData.name}'/></td> </tr>
        //        <tr><td></td><td><input type='button' value='Save' onclick='saveData()'/></td></tr>


        markerForNew.infowindow = new google.maps.InfoWindow({
          content: infoContent
        });


        google.maps.event.addListener(markerForNew, 'click', function() {
          markerForNew.infowindow.open(map, markerForNew);
        });


      }

    }
  $('.createButton').click(function(){
    console.log(map.getCenter().lng());
    console.log(map.getCenter().lat());
    console.log(map.getZoom());

    // var savedMap = new google.maps.Map(document.getElementById('map'), {
    //   center: {lat: map.getCenter().lat(), lng: map.getCenter().lng()},
    //   zoom: map.getZoom(),
    //   mapTypeId: 'roadmap'
    // });

    var savedMap = {
      name: "name",
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng(),
      zoom: map.getZoom()
    };
    console.log('saved map', savedMap);

    $.ajax({
      url: "/maps/map",
      method: "POST",
      data: savedMap,
      // dataType: "json",
      success: (data) => {
        // data = JSON.parse(data);
        console.log('success in mapAjax', data);
      },
      error: (err) => {
        console.log("Err:", err);
    }

    });
  });

    $('.saveMapBtn').click(function(){

      var savedTitle = escape(document.getElementById('mapTitle').value);
      var saveMapTitle = {
        name: savedTitle
      };
      console.log("FIRST TITLE" , saveMapTitle);



    $.ajax({
      url: "/maps/chris",
      method: "POST",
      data: saveMapTitle,
      // dataType: "json",
      success: (data) => {
        // data = JSON.parse(data);
        console.log('success in mapAjax', data);
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
    //     img: 'data:image/jpeg;base64,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'
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
