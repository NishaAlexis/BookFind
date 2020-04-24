var express = require('express');
var app = express();


app.use(express.static('public'));

app.get('/', function (req, res) {
  //res.send('Hello World');
  res.sendfile('index.html');
});

app.listen(3000, function(){
  console.log("Listening on port 3000...")
});

const ContentBasedRecommender = require("content-based-recommender");

const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100
});

// prepare documents data
const documents = [
  {id: '1000001', content: "Young Adult|Fiction|Science Fiction|Dystopia|Fantasy|Science Fiction"},
  {id: '1000002', content: "Fantasy|Young Adult|Fiction"},
  {id: '1000003', content: "Classics|Fiction|Historical|Historical Fiction|Academic|School"},
  {id: '1000004', content: "Classics|Fiction|Romance"},
  {id: '1000005', content: "Young Adult|Fantasy|Romance|Paranormal|Vampires|Fiction|Fantasy|Paranormal"},
  {id: '1000006', content: "Historical|Historical Fiction|Fiction|Young Adult"},
  {id: '1000007', content: "Fantasy|Classics|Fiction|Young Adult|Childrens"},
  {id: '1000008', content: "Classics|Fiction|Science Fiction|Dystopia|Fantasy|Literature|Academic|School|Politics|Science Fiction|Novels|Academic|Read For School"},
  {id: '1000009', content: "Classics|Historical|Historical Fiction|Fiction|Romance|Historical"},
  {id: '1000010', content: "Young Adult|Fiction|Romance|Contemporary"},
  {id: '1000011', content: "Science Fiction|Fiction|Humor|Fantasy|Classics"},
  {id: '1000012', content: "Childrens|Childrens|Picture Books|Classics|Fiction"},
  {id: '1000013', content: "Classics|Fiction|Romance|Literature"},
  {id: '1000014', content: "Fiction|Mystery|Thriller"},
  {id: '1000015', content: "Fiction|Historical|Historical Fiction|Romance|Historical"},
  {id: '1000016', content: "Classics|Fantasy|Fiction|Childrens"},
  {id: '1000017', content: "Fiction|Classics|Horror|Fantasy|Literature|Gothic|Novels|Literature|19th Century|Classics|Classic Literature|European Literature|British Literature"},
  {id: '1000018', content: "Classics|Fiction|Historical|Historical Fiction|Literature"},
  {id: '1000019', content: "Young Adult|Science Fiction|Dystopia|Fiction|Fantasy"},
  {id: '1000020', content: "Classics|Fiction|Romance|Historical|Historical Fiction|Literature|Gothic|Historical|Literature|19th Century|Classics|Classic Literature|Academic|School"},
  {id: '1000021', content: "Classics|Plays|Fiction|Romance|Academic|School|Drama|Academic|Read For School|Literature|Young Adult|High School|Poetry"},  
  {id: '1000022', content: "Classics|Fiction|Young Adult|Academic|School|Literature"},
  {id: '1000023', content: "Fiction|Classics|Fantasy|Philosophy|Novels|Spirituality|Literature|Inspirational|Adventure|Self Help"},
  {id: '1000024', content: "Classics|Fiction|Cultural|Russia|Literature|Literature|Russian Literature"},
  {id: '1000025', content: "Science Fiction|Fiction|Young Adult|Fantasy"}
];

// start training
recommender.train(documents);

//get top 10 similar items to document 1000002
const similarDocuments = recommender.getSimilarDocuments('1000025', 0, 26);

console.log(similarDocuments);

console.log(similarDocuments[0].id);

const fs = require('fs');
fs.readFile('book_dataset.json', 'utf8', (err, fileContents) => {
  if (err) {
    console.error(err)
    return;
  }
  try {
    const data = JSON.parse(fileContents)
    // console.log(data[0]);
    console.log(data[0].author);
    

  } catch(err) {
    console.error(err);
  }
})


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
