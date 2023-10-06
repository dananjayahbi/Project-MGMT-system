const router = require("express").Router();

const {
    addProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject
} = require("../controllers/fiverrProjectController")

//ADD NEW PROJECT
router.post("/addFiverrProject", addProject);

//GET ALL PROJECTS
router.get("/getAllFiverrProjects", getAllProjects);

//GET PROJECT
router.get("/getFiverrProject/:id", getProject);

//UPDATE PROJECT
router.put("/updateFiverrProject/:id", updateProject);

//DELETE PROJECT
router.delete("/deleteFiverrProject/:id", deleteProject);


module.exports = router;