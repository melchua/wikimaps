var markerForNew = null;

var markers = [];


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

    // Ajax call
    $.ajax({
      url: "/maps/" + mapKey + "/places",
      method: "POST",
      data: savedMarker,
      success: (data) => {
        console.log('success in ajax', data);

        marker.infowindow.close();
        $infoBox.get(0).reset();
        getAndRenderMarkers(mapKey);     // TODO: is "data.markers" correct? what is correct?  who is bear?
      },
      error: (err) => {
        console.log("Err:", err);
      }
    });
  });
}


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

function getMapsList() {
  var url = "/maps";
  console.log("starting maps list");
  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: (data) => {
      console.log("WWWWwe are in get maps list success");
      console.log(data);
      renderMaps(data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Err:", textStatus);
    }
  });
}


function renderMaps(maps) {
  $maps_container = $('.maps_list');
  $maps_container.empty();
  for (let map of maps) {
    var $map = createSingleMap(map);
    $maps_container.append($map);
  }
}

function createSingleMap(map) {
  let mapTitle = `<a href=/${map.map_key} class="mapNames">
                  ${map.name}</a>`;
  console.log("map key pleaseee", map.map_key);
  return mapTitle;
}

getMapsList();

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
          draggable: true,
        });
        let infoContent = `

        <form class='savedMarkerInfo'>

        <div class='savedMarkerInfo'>
          <table>
            <tr><td>Name:</td> <td><input type='text' id='name' placeholder='Place name'/></td> </tr>
            <tr><td>Description:</td> <td><input type='text' id='description' placeholder='Enter desc'/></td> </tr>
            <tr><td>Image:</td> <td><input type='text' id='image' placeholder='http://image.jpg'/></td> </tr>
            <tr><td></td><td><input type='button' class='btn btn-outline-info savebutton' value='Save' onclick='saveData(markerForNew)'/></td></tr>
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


/*
 * 5 ways to customize the Google Maps infowindow
 * 2015 - en.marnoto.com
 * http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
*/

// map center
var center = new google.maps.LatLng(40.589500, -8.683542);

// marker position
var factory = new google.maps.LatLng(40.589500, -8.683542);

function initialize() {
  var mapOptions = {
    center: center,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);

  // InfoWindow content
  var content = '<div id="iw-container">' +
                    '<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
                    '<div class="iw-content">' +
                      '<div class="iw-subTitle">History</div>' +
                      '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
                      '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
                      '<div class="iw-subTitle">Contacts</div>' +
                      '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
                      '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
                    '</div>' +
                    '<div class="iw-bottom-gradient"></div>' +
                  '</div>';

  // A new Info Window is created and set content
  var infowindow = new google.maps.InfoWindow({
    content: content,

    // Assign a maximum value for the width of the infowindow allows
    // greater control over the various content elements
    maxWidth: 350
  });

  // marker options
  var marker = new google.maps.Marker({
    position: factory,
    map: map,
    title:"Porcelain Factory of Vista Alegre"
  });

  // This event expects a click on a marker
  // When this event is fired the Info Window is opened.
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  // Event that closes the Info Window with a click on the map
  google.maps.event.addListener(map, 'click', function() {
    infowindow.close();
  });

  // *
  // START INFOWINDOW CUSTOMIZE.
  // The google.maps.event.addListener() event expects
  // the creation of the infowindow HTML structure 'domready'
  // and before the opening of the infowindow, defined styles are applied.
  // *
  google.maps.event.addListener(infowindow, 'domready', function() {

    // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');

    /* Since this div is in a position prior to .gm-div style-iw.
     * We use jQuery and create a iwBackground variable,
     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
    */
    var iwBackground = iwOuter.prev();

    // Removes background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

    // Removes white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    // Moves the infowindow 115px to the right.
    iwOuter.parent().parent().css({left: '115px'});

    // Moves the shadow of the arrow 76px to the left margin.
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

    // Moves the arrow 76px to the left margin.
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

    // Changes the desired tail shadow color.
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

    // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
    if($('.iw-content').height() < 140){
      $('.iw-bottom-gradient').css({display: 'none'});
    }

    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });
  });
}
google.maps.event.addDomListener(window, 'load', initialize);
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
