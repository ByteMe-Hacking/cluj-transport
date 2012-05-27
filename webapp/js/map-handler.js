var map;
var directionsService;
var directionsDisplay;
var directionsService2;
var directionsDisplay2;
var geocoder;
var xssd;
    linia25dCoordinates = [];
    linia25iCoordinates = [];
var optimalDestinations = [];
var startLat = 46.77089669999999;
var startLng = 23.58486110;
var serverData;
function initializeMaps() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(46.7772480, 23.59988990),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    directionsService = new google.maps.DirectionsService();

    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    
    directionsDisplay.setMap(map);
    
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        routeArrived();
    });
    
        directionsService2 = new google.maps.DirectionsService();

    directionsDisplay2 = new google.maps.DirectionsRenderer({
        draggable: true
    });
    
    directionsDisplay2.setMap(map);
    
    google.maps.event.addListener(directionsDisplay2, 'directions_changed', function() {
        routeArrived();
    });

    geocoder = new google.maps.Geocoder();

    imageO = "images/no-logo.png";
    imageB = "images/no-logo.png";
    var j = 0;
    var k = 0;
    for (var i=0; i < linia25.length; i++) {
    	if (linia25[i].tip == "d") {
    		linia25dCoordinates[j] = new google.maps.LatLng(linia25[i].lat, linia25[i].lng);
      		j++;
    	} else {
    		linia25iCoordinates[k] = new google.maps.LatLng(linia25[i].lat, linia25[i].lng);
      		k++;
    	};
    	if (linia25[i].statie != 0) {
    		if (linia25[i].tip == "d") {
    			image = imageO;
    		} else {
    			image = imageB;
    		}
    		var clujMarker = new google.maps.Marker({
      			position: new google.maps.LatLng(linia25[i].lat, linia25[i].lng),
      			map: map,
      			icon: image,
      			animation: google.maps.Animation.DROP,
      			title: linia25[i].denst
  			});
    	}
    };
  	var linia25dPoly = new google.maps.Polyline({
    path: linia25dCoordinates,
    strokeColor: "#e02f00",
    strokeOpacity: 0.8,
    strokeWeight: 7
  	});
  	var linia25iPoly = new google.maps.Polyline({
    path: linia25iCoordinates,
    strokeColor: "#00b0e0",
    strokeOpacity: 0.8,
    strokeWeight: 7
  	});

  	linia25dPoly.setMap(map);
  	linia25iPoly.setMap(map);
$.ajax({
    type: 'GET',
    url: 'http://192.168.1.105:9000/?callback=?',
    dataType: 'jsonp',
    crossDomain: true,
    cache: true,
    success: function( data, status ){
        //alert( data.responseData.results.length + ' results found!' );
        serverData = data[0];
    },
    error: function(xhr, ajaxOptions, thrownError) {
        alert( 'Something goes wrong!' );
        //alert(xhr.status);
        //            alert(thrownError);
    }
});
}


function calculateCost() {
    var distance1 = directionsDisplay.directions.routes[0].legs[0].distance.value;
    var distance2 = directionsDisplay2.directions.routes[0].legs[0].distance.value;
    calculatePrices(distance1, distance2);
}
function callback(response, status) {
  	if (status == google.maps.DistanceMatrixStatus.OK) {
    	var origins = response.originAddresses;
    	var destinations = response.destinationAddresses;
		var min = response.rows[0].elements[0].duration.value;
		var k = 0;
    	for (var i = 0; i < origins.length; i++) {
      		var results = response.rows[i].elements;
      		for (var j = 0; j < results.length; j++) {
        		var element = results[j];
        		var distance = element.distance.text;
        		var duration = element.duration.text;
        		var from = origins[i];
        		var to = destinations[j];
        		if (min > response.rows[i].elements[j].distance.value) {
        			min = response.rows[i].elements[j].distance.value;
        			k = j;
      			};
      		}
    	}
        var request = {
        origin: $('#start').val() + ', 10000 cluj',
        destination: optimalDestinations[k],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    
    
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            routeArrived();
        }
    });
    
     var request2 = {
        origin: serverData.lat + ', ' + serverData.long,
        destination: optimalDestinations[k],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    
    
    directionsService2.route(request2, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay2.setDirections(result);
            routeArrived();
        }
    });
    
    
  }
}

function fetchOptimalRoute() {
	geocoder.geocode({
            'address': $('#start').val()
        }, function(r, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                startLat = releaseEvents.lat;
				startLng = releaseEvents.lng;
            }
           });
        
	var j=0;

	for (var i=0; i < linia25.length; i++) {
		if ((startLat-linia25[i].lat<0.00001)&&(startLng-linia25[i].lng<0.00001)&&(linia25[i].statie!=0)) {
			optimalDestinations[j] = new google.maps.LatLng(linia25[i].lat, linia25[i].lng);
			j++;
			if (j>=20) j=20;
		}
	}
	var distanceMatrixService = new google.maps.DistanceMatrixService();
	distanceMatrixService.getDistanceMatrix(
  		{
    		origins: [$('#start').val() + ', cluj'],
    		destinations: optimalDestinations,
    		travelMode: google.maps.TravelMode.WALKING,
  		}, callback);
}


function htmlGeoReceived(g) {
    if (g.coords.accuracy < 20000) {
    	startLat = g.coords.latitude;
    	startLng = g.coords.longitude;
        geocoder.geocode({
            'latLng': new google.maps.LatLng(g.coords.latitude, g.coords.longitude)
        }, function(r, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $('#start').val(r[0].formatted_address);
            }
        });
    }
}


function requestHtmlGeo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(htmlGeoReceived);
    }
}
