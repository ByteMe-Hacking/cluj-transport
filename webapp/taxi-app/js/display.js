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


function displayPrices(distance, prices) {
    $('#dlgPrices').empty();
    $.each(prices, function (i, e) {
        $('#dlgPrices').append(
            $('<tr></tr>').append(
                $('<td style="width: 10%;"></td>').append($('<img></img>').attr({'src': 'images/' + e.l, 'width':'32px', 'height':'32px'}))
            ).append(
                $('<td style="width: 35%;"></td>').text(e.n)
            ).append(
                $('<td style="width: 20%;"></td>').text(sprintf('%.2f RON', e.c))
            ).append(
                $('<td style="width: 25%;"></td>').text(e.p).css({
                    background: 'url(/images/phone.png) left center no-repeat',
                    paddingLeft: '16px',
                })
            )
        );
    });

    $('#dlgPrices tr:eq(0)').css('font-weight', 'bold');
    $('#dlgDistance').text(sprintf('%.2f km', distance/1000));
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
