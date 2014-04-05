require(['$api/models', '$api/relations', '$api/library'],
  function (models, relations, library) {
    'use strict';

    var results = [];
    var user_genre_map={};
    var user_pic_map = {};

    var global_promises = [];

    function sleep(delay,map) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
        console.log(map);  
        for(user in map)
        {
          console.log("FOUND TOP 3 genres");
          console.log(findTop3(map[user]));
        }
      }

    function Friend(name) {
      this.name = name;
      this.tracks = [];

      this.addTrack = function (artist, track) {
        this.tracks.push({
          "artist": artist,
          "track": track
        });
      }
    }

    models.session.load("user").done(
      function (session) {
        session.user.load("name", "username").done(
          function (user) {
            console.log(user.username.decodeForText());
          }
        );
      }
    );
    var left_to_finish = -1;
    var counter=0;
    var rels = relations.Relations.forCurrentUser();
    rels.load("subscriptions").done(function (rels) {
      rels.subscriptions.snapshot(0, 1000).done(function (snapshot) {
        var subscription_count = Math.min(snapshot.length, 1000);
        for (var i = 0; i < subscription_count; i++) {
          var temp = snapshot.get(i)
          var user = models.User.fromURI(temp.uri.decodeForText());
          user.load('username','name','image').done(function (usrr) {
            user_pic_map[usrr.name]=usrr.image;
            //MEAT OF THE CODE
            var friend = new Friend(usrr.name.decodeForText());
            results.push(friend);
            //console.log('FRIEND COUNT:' + results.length);
            //console.log(results);

            //PRINTING USER NAME IN FRIEND OBJECT
            var lib = library.Library.forUser(usrr);
            lib.load('published').done(function (llib) {
              //console.log(llib);
              llib.published.snapshot(0, 1000).done(function (snapshot) {
                var playlist_count = snapshot.length;
                //console.log("before playlist_count");
                for (var j = 0; j < playlist_count; j++) {
                  //console.log(snapshot.get(j));
                  var playlist_uri = snapshot.get(j).uri;
                  models.Playlist.fromURI(playlist_uri).load('name', 'tracks').done(function (playlist) {
                    //TODO : INCREASE THAT MIN VALUE FROM 5 TO INT_MAX
                    playlist.tracks.snapshot(0, 10000).done(function (snapshot) {
                      var track_count = Math.min(snapshot.length, 3);
                      //console.log("before track_count");
                      for (var k = 0; k < track_count; k++) {
                        //left_to_finish++;
                        var temp_track_uri = snapshot.get(k);
                        models.Track.fromURI(temp_track_uri).load('name', 'artists').done(function (track) {
                          var artist_uri = track.artists[0];
                          if(left_to_finish==-1){left_to_finish+=2;}
                          else{left_to_finish++;} 

                          models.Artist.fromURI(artist_uri).load('name').done( function (artist) {
                            //console.log("Promise finished:" +  artist.name.decodeForText()+":"+track.name.decodeForText()); 
                            friend.addTrack(artist.name.decodeForText(), track.name.decodeForText());                            
                          }
                          );

                          // callbacks.push(function(artist){friend.addTrack(artist.name.decodeForText(), track.name.decodeForText());});

                          // .done(function (artist) {
                          //   //console.log(left_to_finish);
                          //   friend.addTrack(artist.name.decodeForText(), track.name.decodeForText());                            
                          //   left_to_finish--;                            
                          // });

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

  var echoAPIKey = 'ZBX6ON3SVRIGYWMOK';

  setTimeout
  (
    function () {
      console.log("Results Length after 5 seconds = " + results.length);
      var friendCount = results.length;
      //for (var r = 0; r < results.length; r++) {
      for (var r = 0; r < 10 && r < results.length; r++) { //FIX-ME
        var rr = r;
        var f = results[rr];
        console.log("friend : " + f.name);
        //for (var t = 0; t < f.tracks.length; t++){
        for (var t = 0; t < 2 && t < f.tracks.length; t++){ //FIX-Me
          var fname = results[rr].name;
          var requestURL = "http://developer.echonest.com/api/v4/artist/terms?api_key=" + 
              echoAPIKey + 
              "&name="   + 
              f.tracks[t].artist + 
              "&format=json";
          console.log("requestURL : " + requestURL);
          (function (fname2, tt){
            var genres = $.getJSON
            (
              requestURL,
              function(data) {
                try{
                  console.log("friend " + fname2 +" genre " + tt + " response : " + data.response.terms[0].name); 
                  if(fname2 in user_genre_map)
                  {
                    user_genre_map[fname2].push(data.response.terms[0].name);  
                  }          
                  else
                  {
                    user_genre_map[fname2]=[];
                    user_genre_map[fname2].push(data.response.terms[0].name);  
                  }       
                  var item = new Object();
                  item.name = fname2;
                  item.genres = user_genre_map[fname2][0];
                  item.image = user_pic_map[fname2];

                  

                  var divs = document.getElementsByTagName("div");
                  var found = false;
                  var multiGenre = false;
                  for(var di = 0; di < divs.length; di++){
                    var curDiv = divs[di];
                    console.log("for loop");  
                    if(curDiv.getAttribute("nameAttr") == fname2){
                      console.log("nameAttr exists! ");
                      var subDivs = curDiv.getElementsByTagName("div");
                      for(var si = 0; si < subDivs.length; si++){
                        if(subDivs[si].className == "userGenre"){
                          if(multiGenre)
                            subDivs[si].appendChild(document.createTextNode(item.genres));
                        }
                      }
                      found = true;
                    }
                    }
                    if(!found){
                      console.log("creating user");
                      var html = template({items: [item]});
                      //console.log("html:" + html);
                      var div = document.createElement("div");
                      div.setAttribute("nameAttr", fname2);
                      div.innerHTML = html;    
                      document.getElementById("list").appendChild(div);
                    }
                  //}

                       
                }catch(e){
                  console.log("[ERROR] " + e);
                }
              }
            );
           }
          )(fname, t);
          //console.log("friend : " + fname + " genre : " + genres.responseJSON.terms[0].name);
        }
      }
    },
    5000
  );
    //sleep(3000,user_genre_map);
     console.log(user_genre_map);       
      
  });
