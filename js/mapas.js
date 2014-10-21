// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var destino;
var origen;
var geocoder;
var iwOrigen;
var iwDestino;
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

	geocoder = new google.maps.Geocoder();
	iwOrigen = new google.maps.InfoWindow();
	iwDestino = new google.maps.InfoWindow();
	
	origen = new google.maps.Marker({
		map : map,
		draggable : false,
		animation : google.maps.Animation.DROP
	});

	destino = new google.maps.Marker({
		map : map,
		draggable : false,
		animation : google.maps.Animation.DROP
	});

	//autocomplete Options
	var acOptions = {
		types : ['establishment']
	};

	//creation of the autocomplete object
	var ac1 = new google.maps.places.Autocomplete(document.getElementById('origen'), acOptions);
	var ac2 = new google.maps.places.Autocomplete(document.getElementById('destino'), acOptions);

	//binding of the map boundaries to the ac bounderies
	ac1.bindTo('bounds', map);
	ac2.bindTo('bounds', map);
	addListenerOrigen(ac1);
	addListenerDestino(ac2);

	//creation of the listener that responds to locations selected and creation of markers
	function addListenerDestino(ac) {
		google.maps.event.addListener(ac, 'place_changed', function() {
			iwDestino.setContent("");
			iwDestino.close();
			var place = ac.getPlace();
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}

			destino.setPosition(place.geometry.location);
			iwDestino.setContent('<div><strong>' + place.name + '</strong><br>');
			iwDestino.open(map, destino);
			google.maps.event.addListener(destino, 'click', function(e) {
				iwDestino.open(map, destino);
			});
		});
	}

	function addListenerOrigen(ac) {
		google.maps.event.addListener(ac, 'place_changed', function() {
			iwOrigen.setContent("");
			iwOrigen.close();
			var place = ac.getPlace();
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);

			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}

			origen.setPosition(place.geometry.location);
			iwOrigen.setContent('<div><strong>' + place.name + '</strong><br>');
			iwOrigen.open(map, origen);
			google.maps.event.addListener(origen, 'click', function(e) {
				iwOrigen.open(map, origen);
			});
		});
	}
}//end of funtion initialize()

function calcRoute() {
	var request = {
		origin : origen.Position,
		destination : destino.Position,
		travelMode : google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
}

//geolocation function
function getGeo() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			iwOrigen.setMap(map);
			iwOrigen.setPosition(pos);
			geocoder.geocode({
				'latLng' : pos
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						map.setZoom(17);
						origen.setPosition(pos);
						iwOrigen.setContent(results[1].formatted_address);
						iwOrigen.open(map, origen);
						document.getElementById('origen').setAttribute('value',results[1].formatted_address);
					} else {
						alert('No results found');
					}
				} else {
					alert('Geocoder failed due to: ' + status);
				}
			});
			map.setCenter(pos);
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
