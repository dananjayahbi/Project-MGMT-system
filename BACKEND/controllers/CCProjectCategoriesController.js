const CCPCategories = require("../models/ccPCategories.model");

// Add CCP Category
const addCCPCategory = async (req, res) => {
    const {
        categoryName, 
        description
    } = req.body;

    // Check if tax with the same taxName already exists
    const existingCateg = await CCPCategories.findOne({
        $or: [{ categoryName: categoryName }],
    });
    if (existingCateg) {
        return res
        .status(400)
        .json({ error: "A CCP Category with the same name already exists" });
    }

    const category = await CCPCategories.create({
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


//Get All CCP Categories
const getAllCCPCategories = async (req, res) => {
    const abc = await CCPCategories.find()
      .then((categ) => {
        res.json(categ);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a CCP Category
const getCCPCategory = async (req, res) => {
    try {
      const categoryObject = await CCPCategories.findById(req.params.id);
  
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

//Update CCP Category
const updateCCPCategory = async (req, res) => {
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
      const update = await CCPCategories.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'CCP Category updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the CCP Category!',
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

//Delete CCP Category
const deleteCCPCategory= async (req, res) => {
    try {
      const deleted = await CCPCategories.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "CCP Category Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the CCP Category!",
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
    addCCPCategory,
    getAllCCPCategories,
    getCCPCategory,
    updateCCPCategory,
    deleteCCPCategory
}