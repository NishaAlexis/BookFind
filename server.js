var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json())

// app.use(session({
//   secret: 'work hard',
//   resave: true,
//   saveUninitialized: true
// }));

// var login = require('./api/login');
// app.use('/', login);

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:admin8616@cluster0-okijj.gcp.mongodb.net/test?retryWrites=true&w=majority";
const store = new MongoDBStore({
  uri: url,
  collection: 'users'
});
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connected to Database')
  const db = client.db('bookFind')
  const bookCollection = db.collection('book')

  bookCollection.update({}, {$set: {"recoms": []}}, false, true);
  console.log("updated db");

  // ========================
  // Middlewares
  // ========================
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())
  app.use(express.static('public'));

  // app.use(session({
  //   secret: 'work hard',
  //   resave: true,
  //   saveUninitialized: true,
  //   store: store
  // }));

  app.get('/home', function(req, res){
    bookCollection.find({}).limit(12).toArray()
      .then(book => {
        res.render('index', {
          title: "Home",
          header: "Welcome",
          book: book
        });
      })
      .catch(err)
  });

  app.get('/book', (req, res) => {
    bookCollection.aggregate([
      { $match : {bookId : 1000001}},
      { $lookup: {
        from: 'book',
        localField: 'recoms',
        foreignField: 'bookId',
        as: 'recoms_info'
      }}
    ]).toArray()
      .then(book => {
        res.render('single-book', {
          title: "Book Details",
          header: "Welcome",
          breadcrumb: "Book Details",
          page: "Single Book",
          book: book
        });
      })
      .catch(err)
  })

  app.get('/contact', function(req, res){
    res.render('contact', {
      title: "Contact Us",
      header: "Welcome",
      breadcrumb: "Contact Us",
      page: "Contact"
    });
  });
  
  app.get('/account', function(req, res){
    res.render('account', {
      title: "My Account",
      header: "Welcome",
      breadcrumb: "My Account",
      page: "Account"
    });
  });
  
  app.get('/browse', function(req, res){
    bookCollection.find({}).limit(12).toArray()
      .then(book => {
        res.render('featured', {
          title: "Featured Books",
          breadcrumb: "Featured Books",
          page: "Featured",
          book: book
        });
      })
      .catch(err)
  });

  // app.get('/browse/fantasy', function(req, res){
  //   bookCollection.find({content: {$regex: "Fantasy"}}).limit(9).toArray()
  //     .then(book => {
  //       res.render('youngadult', {
  //         title: "Featured Books | Young Adult",
  //         breadcrumb: "Featured Books | Young Adult",
  //         page: "Featured",
  //         book: book
  //       });
  //     })
  //     .catch(err)
  // });

  // app.get('/browse/fantasy', function(req, res){
  //   bookCollection.find({content: {$regex: "Fantasy"}}).limit(9).toArray()
  //     .then(book => {
  //       res.render('featured', {
  //         title: "Featured Books",
  //         breadcrumb: "Featured Books",
  //         page: "Featured",
  //         book: book
  //       });
  //     })
  //     .catch(err)
  // });

  // app.get('/browse/fantasy', function(req, res){
  //   bookCollection.find({content: {$regex: "Fantasy"}}).limit(9).toArray()
  //     .then(book => {
  //       res.render('featured', {
  //         title: "Featured Books",
  //         breadcrumb: "Featured Books",
  //         page: "Featured",
  //         book: book
  //       });
  //     })
  //     .catch(err)
  // });
  
  // app.get('/wishlist', function(req, res){
  //   res.render('wishlist', {
  //     title: "My Wishlist",
  //     breadcrumb: "My Wishlist",
  //     page: "Wishlist"
  //   });
  // });
  
  app.use(function(req, res){
    res.status(404);
    res.render('404', {
      title: "404 Page not Found",
      breadcrumb: "404 Page",
      page: "404 Page"
    });
  });

  app.listen(4000, function () {
    console.log(`listening on 4000`)
  })

})
