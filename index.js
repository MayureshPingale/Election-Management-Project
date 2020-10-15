const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var multer  =   require('multer');


const app = express();

app.use(express.static(__dirname + '/CSS'));
app.use(bodyParser.urlencoded({ extended: true }));

var mongo = require('mongodb'); 
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017";
var storage =   multer.diskStorage({
  // file upload destination
  destination: function (req, file, callback) {
    callback(null, './CSS/upload');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage}).single('filephoto');


app.get('/',function(req,res){

  res.status(200);
	var cityname = req.body.city;
	var consti_name = req.body.consti;
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	var dbo = db.db("wtl_project");

  	dbo.collection("News").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result.length);
    	res.render("Home.ejs",{
		city: cityname,
		consti: consti_name,
		result: result
	});
    db.close();
  });
});
});

app.use('/search',function(req,res) {
	// body...
	res.render("search.ejs");
});


app.use('/check',function(req,res){
	if(req.body.Search=="Search1")
	{
		var name = req.body.Name;
		var fathersname = req.body.fathersname;
		var gender = req.body.gender;
		var date = req.body.birthdate;
		var State = req.body.listBox;
		var City = req.body.secondlist;
		var con = req.body.Constituency;

		MongoClient.connect(url, function(err, db) {
  			if (err) throw err;
  			var dbo = db.db("wtl_project");

  			var query = {
				name: name,
				middle: fathersname,
				gender: gender,
				date: date,
				state: State,
				city: City,
				consti: con
			};
  	
  			console.log(query);
  			dbo.collection("People").find(query).toArray(function(err, result) {
    		if (err) throw err;
    			console.log(result);
    			db.close();
    			res.render('Card.ejs',{
              result:result,
          });
  			});
		});
	}
	else{
			var epicno = req.body.EPICNO;
			var state = req.body.state;
			MongoClient.connect(url, function(err, db) {
  			if (err) throw err;
  			var dbo = db.db("wtl_project");

  			var query = {
			epicno: epicno,
			state: state
			};
  	
  			console.log(query);
  			dbo.collection("People").find(query).toArray(function(err, result) {
    		if (err) throw err;
    			console.log(result);
    		db.close();
    		console.log(query);
			res.render('Card.ejs',{
        result:result
      });
  			}); 
		});
	}
});


app.get("/Register",function(req,res){
	res.render("Reg.ejs");
});

app.post("/Register",function(req,res){

	MongoClient.connect(url, function(err, db) {
  		if (err) throw err;
  		

  		var dbo = db.db("wtl_project");


    		upload(req,res,function(err) {      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any       
      			 if(err) {
            return res.end("Error uploading file.");
        	}

        	var dbo = db.db("wtl_project");
  			var name = req.body.name;
  			var middle = req.body.middle_name;
  			var date = req.body.birthday;
  			var gender = req.body.gender;
  			var state = req.body.State;
  			var city = req.body.City;
  			var consti = req.body.consti;
  			var adhar = req.body.adhar;
  			var email = req.body.email;
  			var phone = req.body.phone;
  			var file = req.file.originalname;

  			  var myobj = { name: name, 
				middle: middle,
				date: date,
				gender: gender,
				state: state,
				city: city,
				consti: consti,
				adhar: adhar,
				email: email,
				phone: phone,
				file: file,
			};
			console.log(myobj)

			dbo.collection("People").insertOne(myobj, function(err, res) {
    		if (err) throw err;
    			console.log("1 document inserted");
   			 db.close();
  			});

        });
        	res.redirect('/');


	}); 
});



app.use('/constituency-information',function(req,res) {
	// body...
	res.render("constituency-information.ejs");
});


app.use('/candidate',function(req,res) {
	// body...

	var cityname = req.body.city;
	var consti_name = req.body.consti;
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	var dbo = db.db("wtl_project");


  	var query = { 
  		City: cityname,
  		consti:consti_name
  	};
  	console.log(query);
  	dbo.collection("Candidate").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result.length);
    	res.render("Candidate.ejs",{
		city: cityname,
		consti: consti_name,
		result: result
	});
    db.close();
  });
});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));