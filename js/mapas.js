// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	//Map options
	var mapOptions = {
		zoom : 12,
		center : new google.maps.LatLng(25.683161, -100.312692),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};

	//Creation of the map object
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	directionsDisplay.setMap(map);

	//autocomplete Options
	var acOptions = {
		types : ['establishment']
	};

	//creation of the autocomplete object
	var ac1 = new google.maps.places.Autocomplete(document.getElementById('origen'), acOptions);
	var ac2 = new google.maps.places.Autocomplete(document.getElementById('destino'), acOptions);
	//binding of the autocomplete object to the map object
	ac1.bindTo('bounds', map);
	ac2.bindTo('bounds', map);
	addListener(ac1);
	addListener(ac2);
	
	//creation of the listener of the autocomplete forms
	function addListener(ac) {
		google.maps.event.addListener(ac, 'place_changed', function() {
			var infoWindow = new google.maps.InfoWindow();
			var marker = new google.maps.Marker({
				map: map,
				draggable: true,
				animation: google.maps.Animation.DROP
			});
			
			infoWindow.close();
			
			var place = ac.getPlace();
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}
			marker.setPosition(place.geometry.location);
			infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
			infoWindow.open(map, marker);
			google.maps.event.addListener(marker, 'click', function(e) {
				infoWindow.open(map, marker);
			});
		});
	}
}//end of funtion initialize()

function calcRoute() {
  var start = ac1.getPlace().geometry.location;
  var end = ac2.getPlace().geometry.location;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}


function obtenerLocal() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var origen = document.getElementById("origen");
			map.setCenter(pos);
			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				draggable: true,
				animation: google.maps.Animation.DROP
			});
			map.setZoom(17);
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}
}

//Error handler for Geolocation
function handleNoGeolocation(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
	} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}

	var options = {
		map : map,
		position : new google.maps.LatLng(60, 105),
		content : content
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}
