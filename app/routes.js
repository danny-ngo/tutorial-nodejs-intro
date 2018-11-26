
module.exports = function(app, passport){

	app.get('/', function(req,res){
		res.render('login');
	});


	app.post('/login', function(req,res){

	});

	app.get('/signup',function(req,res){
		res.render('signup');
	});

	app.get(function(req,res){
		res.render('login');
	});

	function isLoggedIn(req,res,next){
    	if (req.isAuthenticated())
        	return next();
    	
    	res.redirect('/');
	}

}