var marker = null;

function initMap() {
  $(function(){

  //Combined geocaching
  // function initAutocomplete() {
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
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

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
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
       // var map, infoWindow;
            map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 14
        });
        infoWindow = new google.maps.InfoWindow;
      // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
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

    if (!window.cheat) {window.cheat = {};}
    var map, infoWindow;
          map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 14
      });
      infoWindow = new google.maps.InfoWindow;



    // if(true || sessionStorage.getItem('createFlag') === 'active'){
    if(true || window.cheat.createFlag){
      //User can add marker to a map by clicking on the map. The next point clicked will remove the first point clicked

            // Adds a marker to the map and push to the array.
      google.maps.event.addListener(map, 'click', function(event) {
         addMarker(event.latLng);
      });
      function addMarker(location) {
        if (!window.cheat.createFlag) return;
        if(marker)
            marker.setPosition(location);
        else
            marker = new google.maps.Marker({
                position: location,
                flat: false,
                map: map,
                draggable: true
        });
      }
    }


// $(() => {
//       var map, infoWindow;
//       initMap = function (){
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -34.397, lng: 150.644},
//           zoom: 14
//         });
//         infoWindow = new google.maps.InfoWindow;

      // Sets the map on all markers in the array.
      function setMapOnAll(map) {
          marker.setMap(map);
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
       marker.setMap(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
       marker.setMap(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
       clearMarkers();
      }
  });
}
