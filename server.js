var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require("cookie-parser");
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
  console.log('Connected to Database');
  const db = client.db('bookFind');
  const bookCollection = db.collection('book');
  const userCollection = db.collection('user');
  const profileCollection = db.collection('account');


  // ========================
  // Middlewares
  // ========================
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())
  app.use(express.static('public'));
  // app.use(cookieParser());

  // app.use( session({
  //   key: 'user_sid',
  //   secret: "book recommender app",
  //   resave: false,
  //   saveUninitialized: false,
  //   store: store,
  //   cookie: {
  //     expires: 600000
  //   } 
  // }));

  var User = "";

  app.get('/', function(req, res){
    res.render('register', {
      title: "Create an Account",
      breadcrumb: "Register",
      page: "Register"
    });
  })
  app.post('/', function(req, res){
    User = req.body.username;
    userCollection.insertOne({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })
    res.redirect('/account');
  })

  app.get('/login', (req, res) => {
    res.render('login', {
      title: "Sign In to Account",
      breadcrumb: "Login",
      page: "Login"
    });
  })
  app.post('/login', (req, res) => {
    userCollection.findOne({username : req.body.username}, function(err, user) {
      if (user === null){
        res.redirect('/login');
      } else if (user.username === req.body.username && user.password === req.body.password) {
        User = req.body.username;
        res.redirect('/account');
      } else {
        console.log("Credentials Wrong");
        res.redirect('/login');
      }
    })
  })

  function capital_letter(str) {
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
  }

  var bookSearch = '';
  app.get('/home', function(req, res){
    bookCollection.find({}).limit(12).toArray()
      .then(book => {
        res.render('index', {
          title: "Home",
          header: "Welcome " + User,
          book: book
        });
      })
      .catch(err)
  });
  app.post('/home', function(req, res){
    console.log(req.body.search);
    var query = req.body.search;
    bookSearch = query;
    res.redirect('/browse');
  })

  app.get('/book', (req, res) => {
    bookCollection.aggregate([
      { $match : { title: "To Kill a Mockingbird" }},
      { $lookup: {
        from: 'recommendations',
        localField: 'id',
        foreignField: 'bookId',
        as: 'recoms'
      }},
      { $lookup: {
        from: 'book',
        localField: 'recoms.recommendations.bookId',
        foreignField: 'id',
        as: 'recoms_info'
      }}
    ]).toArray()
      .then(book => {
        // console.log(book[0].recoms_info[0].image_url)
        res.render('single-book', {
          title: "Book Details",
          header: "Welcome " + User,
          breadcrumb: "Book Details",
          page: "Single Book",
          book: book
        });
      })
      .catch(err)
  })
  app.get('/book/:id', function(req, res){
    console.log(req.params.id);
    res.end();
  })

  app.get('/account', function(req, res){
    if (User != "") {
      res.render('account', {
        title: "My Account",
        header: "Welcome " + User,
        breadcrumb: "My Account",
        page: "Account"
      });
    } else {
      res.redirect('/');
    }
  });
  app.post('/account', function(req, res) {
    profileCollection.insertOne({
      email: req.body.email,
      fullname: req.body.fullname,
      gender: req.body.gender,
      age_range: req.body.age,
      genre1: req.body.genre1, 
      genre2: req.body.genre2,
      genre3: req.body.genre3
    })
    res.redirect('/browse')
  })

  app.get('/contact', function(req, res){
    res.render('contact', {
      title: "Contact Us",
      header: "Welcome " + User,
      breadcrumb: "Contact Us",
      page: "Contact"
    });
  });
  
  // app.post('/contact', function(req, res){
  //   var name = req.body.username;
  //   var email =req.body.email; 
  //   var phone = req.body.phone; 
  //   var message = req.body.message; 

  //   var data = { 
  //     "name": name, 
  //     "email":email, 
  //     "phone":phone,
  //     "message": message
  //   } 
  //   contactCollection.insertOne(data, function(err, collection){
  //     if (err) throw err; 
  //       console.log("Record inserted Successfully");      
  //   }); 
  //   console.log('Data received:\n' + JSON.stringify(req.body))
  //   return res.redirect('/home'); 
  // })

  var genreSearch = '';
  app.get('/browse', function(req, res){
    //TODO: add if statement for account holders
    if (bookSearch != '') {
      bookCollection.find({$text: {$search: bookSearch}}).limit(12).toArray()
      .then(book => {
        res.render('featured', {
          title: "Featured Books",
          header: "Welcome " + User,
          breadcrumb: "Featured Books",
          page: "Featured",
          book: book
        });
      })
      .catch(err)
    } else if (genreSearch != '') {
      bookCollection.aggregate([
        { $match : { $text: {$search: genreSearch}}},
        { $sample: {size: 12}}
      ]).toArray()
      .then(book => {
        res.render('featured', {
          title: "Featured Books",
          header: "Welcome " + User,
          breadcrumb: "Featured Books",
          page: "Featured",
          book: book
        });
      })
      .catch(err)
    } else {
      bookCollection.find({}).limit(12).toArray()
      .then(book => {
        res.render('featured', {
          title: "Featured Books",
          header: "Welcome " + User,
          breadcrumb: "Featured Books",
          page: "Featured",
          book: book
        });
      })
      .catch(err)
    }
    
  });
  app.get('/browse/:genre', function(req, res){
    var genre = req.params.genre;
    if (genre === "youngadult"){
      genreSearch = "young adult";
    } else if (genre === "sciencefiction") {
      genreSearch = "science fiction";
    } else if (genre === "classics") {
      genreSearch = genre;
    } else if (genre === "fantasy") {
      genreSearch = genre;
    }
    res.redirect('/browse')
  })
  
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
