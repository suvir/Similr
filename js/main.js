require(['$api/models','$api/relations','$api/library'], 
	function(models,relations,library)
	{
		'use strict';

		var results = [];

		function Friend(name){
			this.name = name;
			this.tracks = [];

			this.addTrack = function(artist, track){
				this.tracks.push({"artist" : artist, "track" : track});
			}
		}
		
		models.session.load("user").done(
      function(session){
        session.user.load("name", "username").done(
          function(user){
            console.log(user.username.decodeForText());
          }
        );
      }
    );

		var some_user = models.User.fromUsername('sayedasadali');
		some_user.load('username', 'name').done(function(user) {
  		console.log(user.name.decodeForText());
  	});

		var rels = relations.Relations.forCurrentUser();
		rels.load("subscriptions").done(function(rels)
			{
				rels.subscriptions.snapshot(0, 1000).done(function(snapshot) {
					var len = Math.min(snapshot.length, 1000);
  					for (var i = 0; i < len; i++) {
  						var temp = snapshot.get(i)
    					var user = models.User.fromURI(temp.uri.decodeForText());
						user.load('username', 'name').done(function(usrr) {

							//MEAT OF THE CODE
							var friend = new Friend(usrr.name.decodeForText());
							results.push(friend);
							console.log('FRIEND COUNT:'+results.length);
							console.log(results);

							//PRINTING USER NAME IN FRIEND OBJECT
							var lib = library.Library.forUser(usrr);
  							lib.load('published').done(function(llib){
  								//console.log(llib);
  								llib.published.snapshot(0,1000).done(function(snapshot){
  									var len = snapshot.length;
  									for(var j=0;j<len;j++)
  									{
  										//console.log(snapshot.get(j));
  										var playlist_uri = snapshot.get(j).uri;
  										models.Playlist.fromURI(playlist_uri).load('name','tracks').done(function(playlist) {
  											//TODO : INCREASE THAT MIN VALUE FROM 5 TO INT_MAX
  											playlist.tracks.snapshot(0,10000).done(function(snapshot){
  												var len_tracks = Math.min(snapshot.length,3);
  												for(var k=0; k<len_tracks;k++)
  												{  													
  													var temp_track_uri = snapshot.get(k);
  													models.Track.fromURI(temp_track_uri).load('name','artists').done(function(track) {
													var artist_uri = track.artists[0];
  														models.Artist.fromURI(artist_uri).load('name').done(function(artist) {
															friend.addTrack(artist.name.decodeForText(),track.name.decodeForText());
														});

													});
  												}  											
  										});  																						
									});

  								}
  							});
  						});		
					});
    			}
			});
		});
    });