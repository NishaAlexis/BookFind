var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const Book = require('./models/book');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// const db = require("./mongo_db");
// const dbName = "bookFind";
// const collectionName = "book";

// db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
//   // get all items
//   dbCollection.find({bookId: 1000005}).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//   });

//   // << db CRUD routes >>
//   // app.get("/book/:id", function(req, res){
//   //   const itemId = req.params.id;
//   //   dbCollection.find({bookId : itemId}).toArray(function(err, result) {
//   //     if (err) throw err;
//   //     console.log(result);
//   //   });
//   // });

//   app.get('/book', function(req, res, next){
//     dbCollection.find({bookId: 1000005}).toArray(function(err, book) {
//       if (err) throw err;
//       console.log("query");
//       console.log(book);
//       console.log(book[0].bookId);
//       console.log(book[0].author);
//       res.render('single-book', {
//         title: "Book Details",
//         breadcrumb: "Book Details",
//         page: "Single Book",
//         bookDetails: book[0].bookId,
//       });
//     });

//   });

// }, function(err) { // failureCallback
//   throw (err);
// });


// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb+srv://admin:admin8616@cluster0-okijj.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("bookFind").collection("books");
//   console.log("Database Connected");
//   // perform actions on the collection object
//   client.close();
// });

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: true
}));

var login = require('./api/login');
app.use('/', login);

// function requireLogin (req, res, next) {
//   if (!req.user) {
//     res.redirect('/');
//   } else {
//     next();
//   }
// };

app.get('/home', function(req, res){
  res.render('index', {
    title: "Home"
  });
});

app.get('/book', function(req, res, next){
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
  Book.find({bookId: 1000005}, function(err, book){
    if(err){
      console.error(err);
    } else {
      res.render('single-book', {
        title: "Book Details",
        breadcrumb: "Book Details",
        page: "Single Book",
        bookDetails: book
      });
    }
  })
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
