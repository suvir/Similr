setInterval(
																	function() 
																	{		
																		if(index < len_tracks)
																		{
																			var temp_track_uri = snapshot.get(index);
																			models.Track.fromURI(temp_track_uri).load('name','artists').done(function(track) {
																			var artist_uri = track.artists[0];
				  															models.Artist.fromURI(artist_uri).load('name').done(function(artist) {
																				$.getJSON( "http://developer.echonest.com/api/v4/artist/terms?api_key=" + echoAPIKey + "&name=" + artist.name.decodeForText() + "&format=json",
		  																		function(data) {
				     															//Add the artist, track, genre to the friend object
				     															console.log("Received response from echonest");
				     															console.log(data.response);
				     															friend.addTrack(artist.name.decodeForText(),track.name.decodeForText(),data.response.terms[0].name);
																				index++;
																			}
																		});
																	}		  														  					  															
															  	}},5000);
