const mongoose = require('mongoose');
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, default: '' },
  tags: { type: [String], default: [] }
}, { timestamps: true });
module.exports = mongoose.model('Article', ArticleSchema);
