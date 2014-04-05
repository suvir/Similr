require(['$api/models','$api/relations'], 
	function(models,relations)
	{
		'use strict';
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
				console.log(rels);
				console.log(rels.subscriptions);
				console.log(rels.subscriptions.snapshot);
				rels.subscriptions.snapshot(0, 1000).done(function(snapshot) {
					console.log(snapshot.length);
  					var len = Math.min(snapshot.length, 1000);
  					for (var i = 0; i < len; i++) {
  						var temp = snapshot.get(i)
    					//console.log(snapshot.get(i));
    					//console.log(temp);s

    					var user = models.User.fromURI(temp.uri.decodeForText());
						user.load('username', 'name').done(function(usrr) {
  							console.log(usrr.username + ': ' + usrr.name.decodeForText());  							
						});
    				}
			});
		});
    }
);