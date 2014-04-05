require(['$api/models'], 
	function(models) {

    var user1 = function()
    {
    	models.User.fromUsername('sayedasadali');
		user.load('username', 'name').done(function(user) {
  		console.log(user.username);
  	});
		
	models.session.load("user").done(
      function(session){
        session.user.load("name", "username").done(
          function(user){
            console.log(user.name);
          }
        );
      }
    );
};
	
 });