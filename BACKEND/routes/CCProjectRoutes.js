const router = require("express").Router();

const {
    addProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject
} = require("../controllers/CCProjectController")

//ADD NEW PROJECT
router.post("/addCCProject", addProject);

//GET ALL PROJECTS
router.get("/getAllCCProjects", getAllProjects);

//GET PROJECT
router.get("/getCCProject/:id", getProject);

//UPDATE PROJECT
router.put("/updateCCProject/:id", updateProject);

//DELETE PROJECT
router.delete("/deleteCCProject/:id", deleteProject);


module.exports = router;