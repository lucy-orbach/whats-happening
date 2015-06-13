$(document).ready(function(){
    showElement( $('.banner') );
    getMap();
    $('.banner').click(introAnimation);
  
    
});//document ready

function showElement(element) {
    element.hide().delay( 400 ).fadeIn('slow');
}
function hideElement(element) {
    element.delay( 400 ).fadeOut('slow');
}

function introAnimation (){
    $('.pic').addClass('out');
    hideElement( $('.banner') );

    function showmap() { 
        hideElement($("#intro"));
        setTimeout(transit, 400);
        //$('html,body').animate( { scrollTop:$("#eventsMap").offset().top } ,600);
    }
    function transit(){
      $('.wrapper').addClass('out');
      // .delay( 2000 ).fadeOut();
    }

    setTimeout(showmap, 1000);
}

function getMap () {
    var map;
    
  function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map( mapCanvas, mapOptions );

    // Try HTML5 geolocation
    if(navigator.geolocation) {  
      navigator.geolocation.getCurrentPosition(function(position)  {
        //get coordinates
        var pos = new google.maps.LatLng( position.coords.latitude, 
                                          position.coords.longitude );
        //position user
        var infowindow = new google.maps.InfoWindow({
          map: map,
          position: pos,
          content: 'You are here!'
        });
        //locate map according to user's position
        map.setCenter(pos);
        //get data from NYT api
        getEvents(pos, map);
      }, function() { 
        handleNoGeolocation(true); 
      });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
    //no geolocations
    function handleNoGeolocation(errorFlag) {
      if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
      } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
      }

      var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
      };

      var infowindow = new google.maps.InfoWindow(options);
      map.setCenter(options.position);
    }//handleNoGeo
  }//initialize
  google.maps.event.addDomListener(window, 'load', initialize);

} //getMap

function getEvents(pos, map) {
    var lat = pos.A.toString();
    var lon = pos.F.toString();
    var url = "https://api.nytimes.com/svc/events/v2/listings.jsonp?&ll="+lat+","+lon+"&radius=5000&api-key=58cc54cbffd5159ec6d8eec69468ca3c%3A10%3A63158134"
    //gets data from api
    function getEventsData(){
        $.ajax({
            url: url,
            dataType: 'jsonp'
            }).success(function(events) {
               var array = events.results
                //position tags 
                setTags(array);
        });
    }//getEventData

    //position tags on map
    function setTags(array){
        var marker, i;
        for (i = 0; i < array.length; i++) {  
            
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(array[i].geocode_latitude, array[i].geocode_longitude),
                map: map
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    map.setZoom(15);
                    map.setCenter( marker.getPosition());
                    // var infowindow = new google.maps.InfoWindow({
                    //             map: map,
                    //             position: marker.getPosition()
                    //         });
                    // infowindow.setContent(
                    //     array[i].event_name, 
                    //     array[i].event_detail_url,
                    //     array[i].date_time_description,
                    //     array[i].price);
                var infoBubble = new google.maps.InfoWindow({
                    map: map,
                    content: '<ul class="bubbke"><li><a href="'+array[i].event_detail_url+'" target="_new" >'+array[i].event_name+'</a></li><li>'+array[i].date_time_description+'</li></ul>',
                    position: marker.getPosition(),
                    shadowStyle: 1,
                    padding: 0,
                    backgroundColor: 'rgb(229, 0, 153)',
                    borderRadius: 5,
                    arrowSize: 10,
                    borderWidth: 1,
                    borderColor: '#000000',
                    disableAutoPan: true,
                    hideCloseButton: true,
                    arrowPosition: 30,
                    backgroundClassName: 'transparent',
                    arrowStyle: 2
                });

                    infoWindow.open(map, marker);



                    
                }
            })(marker, i));
        }//for
    }//setTags
 
    getEventsData();
}//getEvents









