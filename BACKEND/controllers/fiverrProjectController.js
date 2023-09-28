const FiverrProjects = require("../models/fiverrProject.model");

//Add Project
const addProject = async (req, res) => {
    const {
        projectName, 
        description,
        startDate,
        deadline,
        priority,
        projectManagers,
        assignedTeamMembers,
        ProjectCategory,
        projectBudjet,
        attachments,
        status,
        notes,
    } = req.body;

    const existingProject = await FiverrProjects.findOne({
        $or: [{ projectName: projectName }],
    });
    if (existingProject) {
        return res
        .status(400)
        .json({ error: "A project with the same project name already exists" });
    }

    const project = await FiverrProjects.create({
        projectName, 
        description,
        startDate,
        deadline,
        priority,
        projectManagers,
        assignedTeamMembers,
        ProjectCategory,
        projectBudjet,
        attachments,
        status,
        notes,
    });

    if (project) {
        res.status(200);
        res.json("project added");
    } else{
        res.status(400);
        res.json("Adding project failed");
    }
};

//Get All Projects
const getAllProjects = async (req, res) => {
    const abc = await FiverrProjects.find()
      .then((projects) => {
        res.json(projects);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a Project
const getProject = async (req, res) => {
    try {
      const projectObject = await FiverrProjects.findById(req.params.id);
  
      if (!projectObject) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      const {
        _id,
        projectName, 
        description,
        startDate,
        deadline,
        priority,
        projectManagers,
        assignedTeamMembers,
        ProjectCategory,
        projectBudjet,
        attachments,
        status,
        notes,
      } = projectObject;
  
      res.status(200).json({
        _id,
        projectName, 
        description,
        startDate,
        deadline,
        priority,
        projectManagers,
        assignedTeamMembers,
        ProjectCategory,
        projectBudjet,
        attachments,
        status,
        notes,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//Update Project
const updateProject = async (req, res) => {
    try {
      const { 
        projectName, 
        description,
        startDate,
        deadline,
        priority,
        projectManagers,
        assignedTeamMembers,
        ProjectCategory,
        projectBudjet,
        attachments,
        status,
        notes,
      } = req.body;
  
      let updateData = {
        projectName, 
        description,
        startDate,
        deadline,
        priority,
        projectManagers,
        assignedTeamMembers,
        ProjectCategory,
        projectBudjet,
        attachments,
        status,
        notes,
      };
  
      // Updating
      const update = await FiverrProjects.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'Project updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the Project!',
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

//Delete Project
const deleteProject = async (req, res) => {
    try {
      const deleted = await FiverrProjects.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "Project Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the Project!",
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
    addProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject
}