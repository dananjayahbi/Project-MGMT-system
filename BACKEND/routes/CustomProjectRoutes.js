const router = require("express").Router();

const {
    addProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject
} = require("../controllers/CustomProjectController")

//ADD NEW PROJECT
router.post("/addCustomProject", addProject);

//GET ALL PROJECTS
router.get("/getAllCustomProjects", getAllProjects);

//GET PROJECT
router.get("/getCustomProject/:id", getProject);

//UPDATE PROJECT
router.put("/updateCustomProject/:id", updateProject);

//DELETE PROJECT
router.delete("/deleteCustomProject/:id", deleteProject);


module.exports = router;