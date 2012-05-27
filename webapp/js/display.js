function positionElements() {
    $('#map-canvas').css({
        height: ($(window).height() - 100) + 'px'
    });
}

var handler = 0;
function initLayout() {
    positionElements();
    $(window).resize(function () {
        if (handler) {
            clearTimeout(handler);
        }

        handler = setTimeout(positionElements, 150);
    });
}


function displayPrices(distance1, distance2) {
    $('#dlgDistance').text(sprintf('%.2f km', distance1/1000));
    $('#dlgDistance2').text(sprintf('%.2f km', distance2/1000));
    $('#priceDisplay').modal();
}

function routeArrived() {
    $('#input-stage').hide();
    $('#output-stage').show();

    var distance = directionsDisplay.directions.routes[0].legs[0].distance.value;
    $('#dlgDistancePreview').text(sprintf('%.2f km', distance/1000));
}

function restartRouting() {
    $('#input-stage').show();
    $('#output-stage').hide();
    
    requestHtmlGeo();
}

$(function () {
    initLayout();
    initializeMaps();
    
    requestHtmlGeo();

    $('#start').keypress(function (e) {
        if ((e.keyCode ? e.keyCode : e.which) == 13) {
            $('#stop').focus();
        }
    });

    $('#stop').keypress(function (e) {
        if ((e.keyCode ? e.keyCode : e.which) == 13) {
            fetchOptimalRoute();
        }
    });
    
    $('#routeButton').click(fetchOptimalRoute);
    $('#calculateButton').click(calculateCost);
    $('#restartButton').click(restartRouting);
});
