var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:admin8616@cluster0-okijj.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const store = new MongoDBStore({
//   uri: url,
//   collection: 'users'
// });
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connected to Database');
  const db = client.db('bookFind');
  const bookCollection = db.collection('book');
  const userCollection = db.collection('user');
  const profileCollection = db.collection('account');
  const wishCollection = db.collection('wishlist');
  const likeCollection = db.collection('wouldLike');
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

  var User = "Testing 123";
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

  app.get('/account', function(req, res){
    if (User != "") {
      var checker;
      userCollection.aggregate([
        { $match : {username : User}},
        { $lookup: {
          from: 'account',
          localField: 'email',
          foreignField: 'email',
          as: 'profileInfo'
        }}
      ]).toArray()
        .then(profile => {
          // console.log(profile[0].profileInfo[0])
          if (profile[0].profileInfo[0] != null) {
            checker = "true";
          } else {
            checker = "false";
          }
          // console.log(checker);
          var empty = "Account Information Unknown"
          if (checker === "false") {
            profile[0].profileInfo.push({
              email: empty,
              fullname: empty,
              gender: empty,
              age_range: empty,
              genre1: empty, 
              genre2: empty,
              genre3: empty
            })            
          }

          res.render('account', {
            title: "My Account",
            header: "Welcome " + User,
            breadcrumb: "My Account",
            page: "Account",
            profile: profile
          });
        });
    } else {
      res.redirect('/');
    }
  });
  app.post('/account', function(req, res) {
    var checker;
    userCollection.aggregate([
      { $match : {username : User}},
      { $lookup: {
        from: 'account',
        localField: 'email',
        foreignField: 'email',
        as: 'profileInfo'
      }}
    ]).toArray()
      .then(profile => {
        // console.log(profile[0].profileInfo[0])
        if (profile[0].profileInfo[0] != null) {
          checker = "true";
        } else {
          checker = "false";
        }
        // console.log(checker);
        if (checker === "false") {
          console.log("Inserting to wishlist");
          profileCollection.insertOne({
            email: req.body.email,
            fullname: req.body.fullname,
            gender: req.body.gender,
            age_range: req.body.age,
            genre1: req.body.genre1, 
            genre2: req.body.genre2,
            genre3: req.body.genre3
          })         
        } else {
          console.log("Updating wishlist");
          wishCollection.updateOne(
            { "username" : User},
            { $set: {
              email: req.body.email,
              fullname: req.body.fullname,
              gender: req.body.gender,
              age_range: req.body.age,
              genre1: req.body.genre1, 
              genre2: req.body.genre2,
              genre3: req.body.genre3
            }}
          )
        }
      });
    res.redirect('/browse')
  })

  var bookSearch = '';
  app.get('/home', function(req, res){
    bookCollection.find().limit(12).toArray()
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
    var query = req.body.search;
    bookSearch = query;
    res.redirect('/browse');
  })

  var bookTitle = '';
  app.get('/book', (req, res) => {
    if (User != ""){
      bookCollection.aggregate([
        { $match : { title : bookTitle }},
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
    } else {
      res.redirect('/')
    }
  })
  app.get('/book/:title', function(req, res){
    var query = req.params.title
    if (query === "Empty"){
      res.redirect('back')
    } else {
      bookTitle = query;
      res.redirect('/book');
    }
  })

  var genreSearch = '';
  app.get('/browse', function(req, res){
    if (User != ""){
      if (bookSearch != '') {
        bookCollection.find(
          {$text: {$search: bookSearch}},
          { projection: {score: { $meta: "textScore"}},
            sort: {score: {$meta : "textScore"}}
          }
        ).limit(15).toArray()
        .then(book => {
          res.render('featured', {
            title: "Featured Books",
            header: "Welcome " + User,
            breadcrumb: "Featured Books",
            page: "Featured " + bookSearch,
            book: book
          });
        })
      } else if (genreSearch != '') {
        bookCollection.aggregate([
          { $match : { $text: {$search: genreSearch}}},
          { $sample: {size: 15}}
        ]).toArray()
        .then(book => {
          res.render('featured', {
            title: "Featured Books",
            header: "Welcome " + User,
            breadcrumb: "Featured Books",
            page: "Featured " + genreSearch,
            book: book
          });
        })
      } else if (bookSearch === '' && genreSearch === '') {
        userCollection.aggregate([
          { $match : {username : User}},
          { $lookup: {
            from: 'account',
            localField: 'email',
            foreignField: 'email',
            as: 'profileInfo'
          }}
        ]).toArray()
          .then(profile => {
            // female = romance, young adult, mystery, humor
            // male = adventure, humor, horror, science fiction
            // book.id == likes[0]

            var genres = profile[0].profileInfo[0].genre1 + " " + profile[0].profileInfo[0].genre2 + " " + profile[0].profileInfo[0].genre3
            bookCollection.find(
              { $text: { $search : genres}},
              { projection: {score: { $meta: "textScore"}},
                sort: {score: {$meta : "textScore"}}
              }
            ).limit(15).toArray()
              .then(book => {
                // console.log(book);
                res.render('featured', {
                  title: "Featured Books",
                  header: "Welcome " + User,
                  breadcrumb: "Featured Books",
                  page: "Featured",
                  book: book
                });
              })
          })
      }
    } else {
      res.redirect('/')
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
    } else if (genre === "clear") {
      genreSearch = '';
      bookSearch = '';
    }
    res.redirect('/browse')
  })

  app.get('/like', function(req, res){
    userCollection.aggregate([
      { $match : {username : User}},
      { $lookup: {
        from: 'account',
        localField: 'email',
        foreignField: 'email',
        as: 'profileInfo'
      }}
    ]).toArray()
      .then(profile => {
        // female = romance, young adult, mystery, humor
        // male = adventure, humor, horror, science fiction
        var gender = profile[0].profileInfo[0].gender;
        var genres = profile[0].profileInfo[0].genre1 + " " + profile[0].profileInfo[0].genre2 + " " + profile[0].profileInfo[0].genre3
        if (gender === "Male") {
          genres = genres + " Adventure Humor Horror Science Fiction"
        } else if (gender === "Female") {
          genres = genres + " Romance Young Adult Mystery Humor"
        }
        bookCollection.find(
          { $text: { $search : genres}},
          { projection: {score: { $meta: "textScore"}},
            sort: {score: {$meta : "textScore"}}
          }
        ).limit(5).toArray()
          .then(recom => {
            res.render('like', {
              title: "Recommendations",
              header: "Welcome " + User,
              breadcrumb: "Would you like to read me?",
              page: "Recommendations",
              recom: recom
            });  
          })
      })
  });
  app.post('/like', function(req, res){
    var str0, str1, str2, str3, str4;
    var strArr0, strArr1, strArr2, strArr3, strArr4;
    str0 = req.body.choice0;
    str1 = req.body.choice1;
    str2 = req.body.choice2;
    str3 = req.body.choice3;
    str4 = req.body.choice4;
    strArr0 = str0.split(/(\s+)/);
    strArr1 = str1.split(/(\s+)/);
    strArr2 = str2.split(/(\s+)/);
    strArr3 = str3.split(/(\s+)/);
    strArr4 = str4.split(/(\s+)/);

    var likes = [];
    var dislikes = [];
    (strArr0[2] === 'like') ? likes.push(strArr0[0]) : dislikes.push(strArr0[0]);
    (strArr1[2] === 'like') ? likes.push(strArr1[0]) : dislikes.push(strArr1[0]);
    (strArr2[2] === 'like') ? likes.push(strArr2[0]) : dislikes.push(strArr2[0]);
    (strArr3[2] === 'like') ? likes.push(strArr3[0]) : dislikes.push(strArr3[0]);
    (strArr4[2] === 'like') ? likes.push(strArr4[0]) : dislikes.push(strArr4[0]);

    console.log(likes)
    console.log(dislikes)
    
    likeCollection.insertOne({
      user: User,
      like: likes,
      dislike: dislikes
    })
  })


  app.get('/wishlist', function(req, res){
    if (User != "") {
      wishCollection.aggregate([
        { $match : {username: User}},
        { $lookup : {
          from: 'book',
          localField: 'wishArray',
          foreignField: 'title',
          as: 'wishInfo'
        }}
      ]).toArray()
      .then(wish => {
        var empty = "Empty";
        for (var i = 0; i < 15; i++){
          if (wish[0].wishInfo[i] == null){
            wish[0].wishInfo.push(
              {title : empty,
              author: empty,
              content: empty,
              image_url: empty}
            )
            //console.log(wish[0].wishInfo[i].title);
          }
        }
        res.render('wishlist', {
          title: "My Wishlist",
          header: "Welcome " + User,
          breadcrumb: "My Wishlist",
          page: "Wishlist",
          wish: wish
        });
      })
    } else {
      res.redirect('/');
    }
  });
  app.get('/wishlist/:title', function(req, res){
    var query = req.params.title;
    var checker;
    wishCollection.find({username : User}).toArray()
      .then(user => {
        // console.log(user[0])
        if (user[0] != null) {
          checker = "true";
        } else {
          checker = "false";
        }
        // console.log(checker);
        if (checker === "true") {
          console.log("Updating wishlist");
          wishCollection.updateOne(
            { "username" : User},
            { $addToSet: {
                wishArray: query
            }}
          )
        } else {
          console.log("Inserting to wishlist");
          wishCollection.insertOne({
            username: User,
            wishArray: [query]
          })
        }
      });
    res.redirect('back')
  });
  app.get('/wishlist/remove/:title', function(req, res){
    var query = req.params.title;
    wishCollection.find({username : User}).toArray()
      .then(deleteWish => {
        console.log("Removing from wishlist");
        wishCollection.updateOne(
          { "username" : User},
          { $pull: {
              wishArray: query
          }}
        )
    })
    res.redirect('back')
  });

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
