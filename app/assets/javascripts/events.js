$(document).ready(function(){
    getMap();
});//document ready

function getMap() {
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
        var image = 'assets/hicon.png';
        for (i = 0; i < array.length; i++) {  

            
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(array[i].geocode_latitude, array[i].geocode_longitude),
                map: map,
                animation: google.maps.Animation.DROP,
                icon: image
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
                    content: "<ul class='bubble'><li><a href='"+
                            array[i].event_detail_url+
                            "' target='_new'>"+array[i].event_name+"</a></li><li>"+array[i].web_description+"</li></ul>",
                    position: marker.getPosition(),
                    shadowStyle: 1,
                    padding: 10,
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderRadius: 15,
                    arrowSize: 10,
                    borderWidth: 2,
                    borderColor: '#E50099',
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
