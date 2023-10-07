const router = require("express").Router();

const {
    addCustPCategory,
    getAllCustomPCategories,
    getCustPCategory,
    updateCustPCategory,
    deleteCustPCategory
} = require("../controllers/CustPCategoriesController")

//ADD NEW CUSTOM PROJECT CATEGORY
router.post("/addCustPCategory", addCustPCategory);

//GET ALL CUSTOM PROJECT CATEGORIES
router.get("/getAllCustPCategories", getAllCustomPCategories);

//GET CUSTOM PROJECT CATEGORY
router.get("/getCustPCategory/:id", getCustPCategory);

//UPDATE CUSTOM PROJECT CATEGORY
router.put("/updateCustPCategory/:id", updateCustPCategory);

//DELETE CUSTOM PROJECT CATEGORY
router.delete("/deleteCustPCategory/:id", deleteCustPCategory);


module.exports = router;