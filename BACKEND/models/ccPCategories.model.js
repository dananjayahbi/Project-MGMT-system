const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newCCPCategory= new Schema(
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

const CCPCategories = mongoose.model("CCPCategories", newCCPCategory);

module.exports = CCPCategories;
