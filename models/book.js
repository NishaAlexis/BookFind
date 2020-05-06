const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  bookId: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image_url: {
    type: String,
    required: true
  }
})

const Book = module.exports = mongoose.model('Book', bookSchema);