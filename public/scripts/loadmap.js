var marker = null;

function initMap() {
  $(function(){
    if (!window.cheat) {window.cheat = {};}
    var map, infoWindow;
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
    }
  });
}

