
//User can add marker to a map by clicking on the map. The next point clicked will remove the first point clicked

      // Adds a marker to the map and push to the array.
google.maps.event.addListener(map, 'click', function(event) {
   addMarker(event.latLng);
});
function addMarker(location) {
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


