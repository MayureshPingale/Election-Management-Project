var expect  = require('chai').expect;
var request = require('request');
var mongo = require('mongodb'); 



var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017";


describe("Homepage access",function(){

    it('Main page content', function(done) {
      request('http://localhost:3000' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
});


describe("Database access",function(){

    it('Database',function(done) {
      MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wtl_project");
      dbo.collection("News").find({}).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        done();
        });
      });
    });
});
