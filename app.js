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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost:27017/bookFind');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { });

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: true
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

// function requireLogin (req, res, next) {
//   if (!req.user) {
//     res.redirect('/');
//   } else {
//     next();
//   }
// };

app.get('/home', requireLogin, function(req, res){
  res.render('index', {
    title: "Home"
  });
});

app.get('/contact', function(req, res){
  res.render('contact', {
    title: "Contact Us",
    breadcrumb: "Contact Us",
    page: "Contact"
  });
});

app.get('/account', function(req, res){
  res.render('account', {
    title: "My Account",
    breadcrumb: "My Account",
    page: "Account"
  });
});

app.get('/book', function(req, res){
  res.render('single-book', {
    title: "Book Details",
    breadcrumb: "Book Details",
    page: "Single Book"
  });
});

app.get('/browse', function(req, res){
  res.render('featured', {
    title: "Featured Books",
    breadcrumb: "Featured Books",
    page: "Featured"
  });
});

app.get('/wishlist', function(req, res){
  res.render('wishlist', {
    title: "My Wishlist",
    breadcrumb: "My Wishlist",
    page: "Wishlist"
  });
});

app.use(function(req, res){
  res.status(404);
  res.render('404', {
    title: "404 Page not Found",
    breadcrumb: "404 Page",
    page: "404 Page"
  });
});

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
