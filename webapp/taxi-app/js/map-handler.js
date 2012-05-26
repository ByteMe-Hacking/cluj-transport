var map;
var directionsService;
var directionsDisplay;
var geocoder;


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

    geocoder = new google.maps.Geocoder();
}


function calculateCost() {
    var distance = directionsDisplay.directions.routes[0].legs[0].distance.value;
    calculatePrices(distance);
}


function fetchOptimalRoute() {
    var request = {
        origin: $('#start').val() + ', 10000 cluj',
        destination: $('#stop').val() + ', 10000 cluj',
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            routeArrived();
        }
    });
}


function htmlGeoReceived(g) {
    if (g.coords.accuracy < 20000) {
        geocoder.geocode({
            'latLng': new google.maps.LatLng(g.coords.latitude, g.coords.longitude)
        }, function(r, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $('#start').val(r[0].formatted_address);
                $('#stop').focus();
            }
        });
    }
}


function requestHtmlGeo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(htmlGeoReceived);
    }
}
