$(document).ready(function () {
    navigator.geolocation.getCurrentPosition(initMap);

});


//var reverseGeolocate = function (url, data, successCallback) {
//    $.get(url, data, successCallback).fail(function () {
//        console.log("Could not reverse geolocate");
//    });
//};


var geocoder = new google.maps.Geocoder;
function reverseGeolocate(position, callback) {
    // Does not work as expected. Must switch to the JS api call.
    // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=<API KEY HERE>
    var latlng = {lat: position.lat, lng: position.lng};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                console.log("Results:", results);
                callback(results[0].formatted_address)
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function initMap(position) {
    var positionCoOrdinates = {lat: position.coords.latitude, lng: position.coords.longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: positionCoOrdinates
    });

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
        '<div id="bodyContent">' +
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the ' +
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
        'Aboriginal people of the area. It has many springs, waterholes, ' +
        'rock caves and ancient paintings. Uluru is listed as a World ' +
        'Heritage Site.</p>' +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
        '(last visited June 22, 2009).</p>' +
        '<button>This is a button</button>' +
        '</div>' +
        '</div>';


    var mapMarker = {
        path: "m10.52955,28.048c-1.35141,0 -7.47049,-13.09363 -7.47049,-18.3592c-0.00005,-3.68774 3.35206,-6.68881 7.47049,-6.68881c4.11898,0 7.46891,3.00107 7.46891,6.68881c0.00055,5.26557 -6.11804,18.3592 -7.46891,18.3592zm0,-23.51228c-3.17345,0 -5.75492,2.31194 -5.75492,5.15308s2.58147,5.15308 5.75492,5.15308c3.1729,0 5.75382,-2.3115 5.75382,-5.15308c0.00055,-2.84163 -2.58201,-5.15308 -5.75382,-5.15308z",
        fillColor: 'red',
        fillOpacity: 1,
        scale: 1,
        strokeColor: 'Blue',
        strokeWeight: 0,
        anchor: new google.maps.Point(10, 30)
    };

    var image = {
        url: 'https://cdn0.iconfinder.com/data/icons/smoothies-vector-icons-volume-6/48/21-128.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 0)
    };

    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };
    var marker = new google.maps.Marker;
    var infowindow = new google.maps.InfoWindow;





    marker.addListener('click', function () {
        //var content = "Load the content here via Ajax maybe...for each marker...or load it from the database in the object.";
        //infowindow.content = content;


        // Reverse Geo Locate Data
        var latitude = position.coords.latitude,
            longitude = position.coords.longitude,
            geoLocationUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

        var data = {latlng: latitude + "," + longitude, language: $storeLocatorForm.data('language')};

        var geoLocationSuccessCallback = function (geoLocationResponse) {
            var formattedAddress = geoLocationResponse.results[0].formatted_address;
            marker.setData({
                position: positionCoOrdinates,
                map: map,
                icon: mapMarker,
                shape: shape,
                title: formattedAddress
            });



            infowindow.setContent(formattedAddress);
            infowindow.open(map, marker);

        };

        reverseGeolocate(geoLocationUrl, data, geoLocationSuccessCallback);
    });


    // ******************************************************
    // ************    Add a marker on click    *************
    // ******************************************************


    function addMarker(event, map) {
        console.log(event.latLng.lat(), event.latLng.lng());
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        var marker = new google.maps.Marker({
            position: event.latLng,
            map: map

        });
        marker.addListener('click', function () {
            var position = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            reverseGeolocate(position, function (title) {
                console.log("Title:", title);
                infowindow.setContent(title);
                infowindow.open(map, marker);
            });
            //var content = "Load the content here via Ajax maybe...for each marker...or load it from the database in the object.";

        });

    }

    google.maps.event.addListener(map, 'click', function (event) {
        addMarker(event, map);
    });
}