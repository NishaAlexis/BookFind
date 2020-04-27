//var mongo = require('mongodb');
// var MongoClient = require('mongodb').MongoClient;
// //Create a database named "mydb":
// var url = "mongodb://localhost:27017/bookFind";

// MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db){
//   console.log("Connected");
//   var cursor = db.collection('books').find({author: "C.S. Lewis"});
//   cursor.each(function(err, doc){
//     console.log(doc);
//   })
//   db.close();
// });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("bookFind");
  var query = {author: "Harper Lee"};
  dbo.collection("books").find(query, {projection: {image_url: 1}}).toArray(function(err, result){
    console.log(result);  
    db.close();
  });

});