var priceMap = [
    {
        name: 'Diesel',
        logo: 'no-logo.png',
        phone: '0264-946',
        start: 1.79,
        kilometer: 1.79,
        included: 0
    },
    {
        name: 'Diesel 947',
        logo: 'no-logo.png',
        phone: '0264-947',
        start: 1.79,
        kilometer: 1.79,
        included: 0
    },
    {
        name: 'Taxi Napoca',
        logo: 'no-logo.png',
        phone: '0264-953',
        start: 3.29,
        kilometer: 1.79,
        included: 1000
    },
    {
        name: 'Pro Rapid',
        logo: 'no-logo.png',
        phone: '0264-948',
        start: 5.49,
        kilometer: 1.79,
        included: 2000
    },
    {
        name: 'Nova Taxi',
        logo: 'no-logo.png',
        phone: '0264-949',
        start: 1.79,
        kilometer: 1.79,
        included: 0
    },
    {
        name: 'Pritax',
        logo: 'no-logo.png',
        phone: '0264-942',
        start: 1.99,
        kilometer: 1.79,
        included: 0
    },
    {
        name: 'Terra&Fan',
        logo: 'no-logo.png',
        phone: '0264-944',
        start: 1.49,
        kilometer: 1.79,
        included: 0
    },
    {
        name: 'Clima&Confort',
        logo: 'no-logo.png',
        phone: '0264-943',
        start: 1.79,
        kilometer: 1.79,
        included: 0
    }
];


function calculatePrices(distance) {
    var prices = $.map(priceMap, function (taxi) {
        var bd = Math.max(0, distance - taxi.included);
        var cost = taxi.start + (bd / 1000) * taxi.kilometer;

        return { n: taxi.name, l: taxi.logo, p: taxi.phone, c: cost };
        
    }).sort(function (a, b) {
        return a.c < b.c ? -1 : 1;
    });

    displayPrices(distance, prices);
}