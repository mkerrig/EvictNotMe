$(document).ready(function() {
  // If the browser supports the Geolocation API
  if (typeof navigator.geolocation == "undefined") {
    $("#error").text("Your browser doesn't support the Geolocation API");
    return;
  }

  //Tabs listener
  tabsListener();

  //finding user location when pressing the submit button
  findUserLocation();

  //Generating Direction from user A to user B using their account GPS
  anotherUserLocationtextInputListener();
});

//Tabs listener
var tabsListener = function() {
  $(".tabs-menu a").click(function(event) {
      event.preventDefault();
      $(this).parent().addClass("current");
      $(this).parent().siblings().removeClass("current");
      var tab = $(this).attr("href");
      $(".tab-content").not(tab).css("display", "none");
      $(tab).fadeIn();
  });
}

//finding user location when pressing the submit button
var findUserLocation = function() {
  $("#from-link, #to-link").click(function(event) {
    event.preventDefault();
    var addressId = this.id.substring(0, this.id.indexOf("-"));

    navigator.geolocation.getCurrentPosition(function(position) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
          $("#" + addressId).val(results[0].formatted_address);
        else
          $("#error").append("Unable to retrieve your address<br />");
      });
    },
    function(positionError){
      $("#error").append("Error: " + positionError.message + "<br />");
    },
    {
      enableHighAccuracy: true,
      timeout: 10 * 1000 // 10 seconds
    });
  });

  $("#calculate-route").submit(function(event) {
    event.preventDefault();
    calculateRoute($("#from").val(), $("#to").val());
  });
}

//Generating Direction from A to B
function calculateRoute(from, to) {
  // Center initialized to San Francisco, CA
  var myOptions = {
    zoom: 10,
    center: new google.maps.LatLng(37.7749, 122.4194),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // Draw the map
  var mapObject = new google.maps.Map(document.getElementById("body-right-container"), myOptions);

  var directionsService = new google.maps.DirectionsService();
  var directionsRequest = {
    origin: from,
    destination: to,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  };
  directionsService.route(
    directionsRequest,
    function(response, status)
    {
      if (status == google.maps.DirectionsStatus.OK)
      {
        new google.maps.DirectionsRenderer({
          map: mapObject,
          directions: response
        });
      }
      else
        $("#error").append("Unable to retrieve your route<br />");
    }
  );
}

//Generating Direction from user A to user B using their account GPS
var anotherUserLocationtextInputListener = function() {
  $("#pos-from-link").click(function(event) {
    event.preventDefault();
    var addressId = this.id.substring(0, this.id.indexOf("-"));

    navigator.geolocation.getCurrentPosition(function(position) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
          $("#" + addressId).val(results[0].formatted_address);
        else
          $("#error").append("Unable to retrieve your address<br />");
      });
    },
    function(positionError){
      $("#error").append("Error: " + positionError.message + "<br />");
    },
    {
      enableHighAccuracy: true,
      timeout: 10 * 1000 // 10 seconds
    });
  });

  $("#calculate-route-friend").submit(function(event) {
    event.preventDefault();

    // var friendsLocation = $("#friend").val();

    formData = $('#calculate-route-friend').serialize();
    // console.log(formData);

    var jqXHR = $.ajax({
      url: '/users/find',
      type: 'get',
      data: formData
    });

    jqXHR.done(function(data) {
      // console.log(data);
      calculateRoute($("#pos").val(), data);
    });

    jqXHR.fail(function(error) {
      console.log(error.responseText);
    });
  });
}



