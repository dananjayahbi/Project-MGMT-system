const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newCustomPCategory= new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CustomPCategories = mongoose.model("CustomPCategories", newCustomPCategory);

module.exports = CustomPCategories;
