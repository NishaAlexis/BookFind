var express = require('express');
var app = express();
// const recommendations = require('./recommender');


app.use(express.static('public'));

app.get('/', function (req, res) {
  //res.send('Hello World');
  res.sendfile('index.html');
});

app.listen(3000, function(){
  console.log("Listening on port 3000...")
});

// console.log(recommendations);
// var i;
// for (i = 0; i < recommendations.length; i++) {
//   console.log(recommendations[i].id);
// }


const fs = require('fs');
fs.readFile('recommendations.json', 'utf8', (err, fileContents) => {
  if (err) {
    console.error(err)
    return;
  }
  try {
    const data = JSON.parse(fileContents)
    console.log(data[0]);
    console.log(data[0].id1000001);
    console.log(data[0].id1000001[0]);
    console.log(data[0].id1000001[0].id);    

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
