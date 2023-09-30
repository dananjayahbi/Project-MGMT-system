const FPCategories = require("../models/fPcategories.model");

// Add FP Category
const addFPCategory = async (req, res) => {
    const {
        categoryName, 
        description
    } = req.body;

    // Check if tax with the same taxName already exists
    const existingCateg = await FPCategories.findOne({
        $or: [{ categoryName: categoryName }],
    });
    if (existingCateg) {
        return res
        .status(400)
        .json({ error: "A FP Category with the same name already exists" });
    }

    const category = await FPCategories.create({
        categoryName, 
        description
    });

    if (category) {
        res.status(200);
        res.json("Category added");
    } else{
        res.status(400);
        res.json("Adding Category failed");
    }
};


//Get All FP Categories
const getAllFPCategories = async (req, res) => {
    const abc = await FPCategories.find()
      .then((categ) => {
        res.json(categ);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a FP Category
const getFPCategory = async (req, res) => {
    try {
      const categoryObject = await FPCategories.findById(req.params.id);
  
      if (!categoryObject) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      const {
        _id,
        categoryName, 
        description,
      } = categoryObject;
  
      res.status(200).json({
        _id,
        categoryName, 
        description,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//Update FP Category
const updateFPCategory = async (req, res) => {
    try {
      const { 
        categoryName, 
        description,
      } = req.body;
  
      let updateData = {
        categoryName, 
        description,
      };
  
      // Updating
      const update = await FPCategories.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'FP Category updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the FP Category!',
          status: false,
        });
      }
      
    } catch (error) {
      res.status(401).json({
        errorMessage: 'Something went wrong!\n' + error,
        status: false,
      });
    }
  };

//Delete FP Category
const deleteFPCategory= async (req, res) => {
    try {
      const deleted = await FPCategories.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "FP Category Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the FP Category!",
          status: false,
        });
      }
    } catch (error) {
      res.status(401).json({
        errorMessage: "Something went wrong!\n" + error,
        status: false,
      });
    }
  };


//Export
module.exports = {
    addFPCategory,
    getAllFPCategories,
    getFPCategory,
    updateFPCategory,
    deleteFPCategory
}