const router = require("express").Router();

const {
    addCCPCategory,
    getAllCCPCategories,
    getCCPCategory,
    updateCCPCategory,
    deleteCCPCategory
} = require("../controllers/CCProjectCategoriesController")

//ADD NEW FP CATEGORY
router.post("/addCCPCategory", addCCPCategory);

//GET ALL FP CATEGORIES
router.get("/getAllCCPCategories", getAllCCPCategories);

//GET FP CATEGORY
router.get("/getCCPCategory/:id", getCCPCategory);

//UPDATE FP CATEGORY
router.put("/updateCCPCategory/:id", updateCCPCategory);

//DELETE FP CATEGORY
router.delete("/deleteCCPCategory/:id", deleteCCPCategory);


module.exports = router;