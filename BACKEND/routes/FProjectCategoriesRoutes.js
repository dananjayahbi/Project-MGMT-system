const router = require("express").Router();

const {
    addFPCategory,
    getAllFPCategories,
    getFPCategory,
    updateFPCategory,
    deleteFPCategory,
} = require("../controllers/FProjectCategoriesController")

//ADD NEW FP CATEGORY
router.post("/addFPCategory", addFPCategory);

//GET ALL FP CATEGORIES
router.get("/getAllFPCategories", getAllFPCategories);

//GET FP CATEGORY
router.get("/getFPCategory/:id", getFPCategory);

//UPDATE FP CATEGORY
router.put("/updateFPCategory/:id", updateFPCategory);

//DELETE FP CATEGORY
router.delete("/deleteFPCategory/:id", deleteFPCategory);


module.exports = router;