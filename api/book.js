const {Router} = require("express");
const fs = require('fs');
const path = require("path");

const router = new Router();

router.get("/book",function(req,res){
  res.sendFile(path.join(__dirname, './views/single-book.html'));
});




router.get('/book', (req, res) => {
  //res.send('Get a random book');
  const dirPath = path.join(__dirname, '../book_dataset.json')
  fs.readFile(dirPath, (err, fileContents) => {
    if (err) {
      console.error(err)
      return;
    }
    try {
      const data = JSON.parse(fileContents)
      //res.sendFile());
      //res.send(data[0]);
  
    } catch(err) {
      console.error(err);
    }
  })
});

module.exports = router;