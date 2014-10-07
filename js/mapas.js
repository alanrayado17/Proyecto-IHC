// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;

function initialize() {
	//Map options
	var mapOptions = {
		zoom : 15
	};
	
	//Creation of the map object
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	//autocomplete Options
	var acOptions = {
		types : ['establishment']
	};
	
	//creation of the autocomplete object
	var ac1 = new google.maps.places.Autocomplete(document.getElementById('ac1'), acOptions);
	var ac2 = new google.maps.places.Autocomplete(document.getElementById('ac2'), acOptions);
	//binding of the autocomplete object to the map object
	ac1.bindTo('bounds', map);
	ac2.bindTo('bounds', map);
	//creation of the listener that responds to typed text
	google.maps.event.addListener(ac1, 'place_changed', function() {
		infoWindow.close();
		var place = ac1.getPlace();
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
	
	google.maps.event.addListener(ac2, 'place_changed', function() {
		infoWindow.close();
		var place = ac2.getPlace();
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

	// Try HTML5 geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(pos);
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}
}//end of funtion initialize()

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

function ruta(){
	
}
