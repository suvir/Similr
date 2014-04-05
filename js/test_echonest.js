
var echoAPIKey = 'ZBX6ON3SVRIGYWMOK';
  var artist = 'The Doors';
  var title = 'Riders on the storm' 
  var genres = $.getJSON( "http://developer.echonest.com/api/v4/artist/terms?api_key=" + echoAPIKey + "&name=" + artist + "&format=json",
  function(data) {
     console.log(data.response.terms[0].name); 
});

//var main_genre = genres[0];