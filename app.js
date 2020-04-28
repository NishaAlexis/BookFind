var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bookFind');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { });

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoDBStore({
    url: "mongodb://localhost:27017/bookFind",
    collection: 'account'
  })
}));

var routes = require('./api/login');
app.use('/', routes);

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
// var str = "";
// app.get('/test', function (req, res) {
//   MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("bookFind");
//     var query = {author: "Harper Lee"};
//     var cursor = dbo.collection('books').find((query, {projection: {title: 1}}));
//     cursor.forEach(function(item){
//       if (item != null) {
//         str = str + "    Book Title  " + item.title + "</br>";
//         console.log(str);
//         //res.send(str);
//       }}, function(err) {
//         res.send(err);
//         db.close();
//       });
//   });
// })

// app.use(loginRouter);

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, './views/index.html'));
// });
// app.get("/about",function(req,res){
//   res.sendFile(path.join(__dirname, './views/about.html'));
// });
// app.get("/contact",function(req,res){
//   res.sendFile(path.join(__dirname, './views/contact.html'));
// });
// app.get("/book",function(req,res){
//   res.sendFile(path.join(__dirname, './views/single-book.html'));
// });
// app.get("/profile",function(req,res){
//   res.sendFile(path.join(__dirname, './views/my-account.html'));
// });
// app.get("/login",function(req,res){
//   res.sendFile(path.join(__dirname, './views/login.html'));
// });
// app.get("/browse",function(req,res){
//   res.sendFile(path.join(__dirname, './views/shop.html'));
// });
// app.get("*",function(req,res){
//   res.sendFile(path.join(__dirname, './views/404.html'));
// });

app.listen(3000, function(){
  console.log("Listening on port 3000...")
});

// console.log(recommendations);
// var i;
// for (i = 0; i < recommendations.length; i++) {
//   console.log(recommendations[i].id);
// }
// router.get('/listbooks', (req, res) => {
//   //res.send('Get a random book');
//   const dirPath = path.join(__dirname, '../recommendations.json')
//   fs.readFile(dirPath, (err, fileContents) => {
//     if (err) {
//       console.error(err)
//       return;
//     }
//     try {
//       const data = JSON.parse(fileContents)
//       res.send(data);
//       // console.log(data[0]);
//       // console.log(data[0].id1000001);
//       // console.log(data[0].id1000001[0]);
//       console.log(data[0].id1000001[0].id);     
//     } catch(err) {
//       console.error(err);
//     }
//   })
// });


// app.post('/submit-student-data', function (req, res) {
//   var name = req.body.firstName + ' ' + req.body.lastName;
//   res.send(name + ' Submitted Successfully!');
// });


// makeAPICall('/example')
//   .then(function(res) { // Like earlier, fires with success and response from '/example'.
//     return makeAPICall(`/newExample/${res.UserName}`); // Returning here lets us chain on a new .then().
//    })
//   .then(function(res) { // Like earlier, fires with success and response from '/newExample'.
//     console.log(res);
//    })
//   .catch(function(err) { // Generic catch all method. Fires if there is an err with either earlier call.
//     console.log('Error: ', err);
//    });
