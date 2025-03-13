const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
