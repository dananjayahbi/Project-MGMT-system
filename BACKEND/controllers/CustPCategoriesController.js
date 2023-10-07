const CustomPCategories = require("../models/CustPCategories.model");

// Add CustP Category
const addCustPCategory = async (req, res) => {
    const {
        categoryName, 
        description
    } = req.body;

    // Check if tax with the same taxName already exists
    const existingCateg = await CustomPCategories.findOne({
        $or: [{ categoryName: categoryName }],
    });
    if (existingCateg) {
        return res
        .status(400)
        .json({ error: "A Custom Project Category with the same name already exists" });
    }

    const category = await CustomPCategories.create({
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


//Get All CustP Categories
const getAllCustomPCategories = async (req, res) => {
    const abc = await CustomPCategories.find()
      .then((categ) => {
        res.json(categ);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a CustP Category
const getCustPCategory = async (req, res) => {
    try {
      const categoryObject = await CustomPCategories.findById(req.params.id);
  
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

//Update CustP Category
const updateCustPCategory = async (req, res) => {
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
      const update = await CustomPCategories.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'Custom Project Category updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the Custom Project Category!',
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

//Delete CustP Category
const deleteCustPCategory= async (req, res) => {
    try {
      const deleted = await CustomPCategories.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "Custom Project Category Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the Custom Project Category!",
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
    addCustPCategory,
    getAllCustomPCategories,
    getCustPCategory,
    updateCustPCategory,
    deleteCustPCategory
}