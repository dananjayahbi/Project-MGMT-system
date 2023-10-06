const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newFPCategory= new Schema(
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

const FPCategories = mongoose.model("FPCategories", newFPCategory);

module.exports = FPCategories;
