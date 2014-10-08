// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var destino;
var origen;

function initialize() {
	//Map options
	var mapOptions = {
		zoom : 12,
		center : new google.maps.LatLng(25.683161, -100.312692),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};

	//Creation of the map object
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	origen = new google.maps.Marker({
		map : map,
		draggable : true,
		animation : google.maps.Animation.DROP
	});
	
	destino = new google.maps.Marker({
		map : map,
		draggable : true,
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
			var infoWindow = new google.maps.InfoWindow();
			infoWindow.setContent("");
			infoWindow.close();
			var place = ac.getPlace();
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}

			destino.setPosition(place.geometry.location);
			infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
			infoWindow.open(map, destino);
			google.maps.event.addListener(destino, 'click', function(e) {
				infoWindow.open(map, destino);
			});
		});
	}

	function addListenerOrigen(ac) {
		google.maps.event.addListener(ac, 'place_changed', function() {
			var infoWindow = new google.maps.InfoWindow();
			infoWindow.setContent("");
			infoWindow.close();
			var place = ac.getPlace();
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);

			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}

			origen.setPosition(place.geometry.location);
			infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
			infoWindow.open(map, origen);
			google.maps.event.addListener(origen, 'click', function(e) {
				infoWindow.open(map, origen);
			});
		});
	}

}//end of funtion initialize()

function ruta() {

}

//geolocation function
function obtenerGeo() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var infoWindow = new google.maps.InfoWindow();
			infoWindow.setContent("");
			infoWindow.close();
			origen.setPosition(pos);
			map.setCenter(pos);
			map.setZoom(17);
			infoWindow.setContent('<div><strong>' + geocoder.geocode({'latLng':pos},callback) + '</strong><br>');
			infoWindow.open(map, origen);
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
