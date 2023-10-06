const CCProjects = require("../models/ccProject.model");

// Function to generate a random PID
function generateRandomPID() {
  const prefix = 'CC'; // First 2 letters
  const length = 10; // Total length of the PID
  const digits = '0123456789'; // Allowed digits

  let pid = prefix;

  for (let i = 0; i < length - prefix.length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      pid += digits[randomIndex];
  }

  return pid;
}

// Add Project
const addProject = async (req, res) => {
  const {
    projectName,
    description,
    startDate,
    deadline,
    priority,
    projectManagers,
    teamMembers,
    ProjectCategory,
    projectBudget,
    attachments,
    status,
    notes,
} = req.body;

  let existingProject;
  let project;
  let pid; // Declare pid variable outside of the loop

  do {
      pid = generateRandomPID(); // Assign the generated PID
      existingProject = await CCProjects.findOne({
          PID: pid,
      });
  } while (existingProject);

  project = await CCProjects.create({
    PID: pid,
    projectName,
    description,
    startDate,
    deadline,
    priority,
    projectManagers,
    teamMembers,
    ProjectCategory,
    projectBudget, // Corrected property name
    attachments,
    status,
    notes,
});

  if (project) {
      res.status(200);
      res.json("Project added");
  } else {
      res.status(400);
      res.json("Adding project failed");
  }
};


//Get All Projects
const getAllProjects = async (req, res) => {
    const abc = await CCProjects.find()
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
      const projectObject = await CCProjects.findById(req.params.id);
  
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
        teamMembers,
        ProjectCategory,
        projectBudget,
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
        teamMembers,
        ProjectCategory,
        projectBudget,
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
        teamMembers,
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
        teamMembers,
        ProjectCategory,
        projectBudjet,
        attachments,
        status,
        notes,
      };
  
      // Updating
      const update = await CCProjects.findByIdAndUpdate(req.params.id, updateData);
  
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
      const deleted = await CCProjects.findByIdAndDelete(req.params.id);
  
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