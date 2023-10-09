import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import {Add as AddIcon} from "@mui/icons-material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import TasksTable from "../../components/Dashboard/TasksTable";
import AddFPTask from "./AddFPTask";
//import DeleteFProject from "./DeleteFProject";

export default function ManageFPTasks() {
  const [FProjects, setFProjects] = useState([]);
  const [filteredFProjects, setFilteredFProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddFPTask, setOpenPopupAddFPTask] = useState(false); 
  const [openPopupUpdateFPTask, setOpenPopupUpdateFPTask] = useState(false);
  const [openPopupDeleteFProject, setOpenPopupDeleteFProject] = useState(false);
  const [fetchedFPID, setFetchedFPID] = useState(null);
  const [fetchedFProject, setFetchedFProject] = useState(null); //for delete functionality
  const [showDropdown, setShowDropdown] = useState(false); // Control the visibility of the dropdown
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);

  
  //Fetch All Fiverr Projects
  useEffect(() => {
    const fetchFProjects = async () => {
      try {
        const response = await fetch("http://localhost:8070/fiverrProjects/getAllFiverrProjects");
        const data = await response.json();
        setFProjects(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchFProjects();
  }, [openPopupAddFPTask, openPopupUpdateFPTask, openPopupDeleteFProject]);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    const filtered = FProjects.filter((fProjects) =>
      fProjects.projectName &&
      fProjects.projectName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFProjects(filtered);
    setShowDropdown(filtered.length > 0);
  };


  const handleProjectClick = (project) => {
    //console.log("Selected Project:", project.projectName);
    setSelectedProject(project.projectName);
    setSelectedProjectTasks(project.tasks || []);
    setFetchedFPID(project._id);
   //console.log(project._id)
    setSearchTerm(project.projectName); // Update the search term
    setShowDropdown(false);
  };

  useEffect(() => {
    // Event listener to close the dropdown when clicking away
    const closeDropdownOnOutsideClick = (event) => {
      if (showDropdown && !tableRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
    };
  }, [showDropdown]);
  

  //Handle Update
  function handleUpdate(FPID){
    setFetchedFPID(FPID);
    setOpenPopupUpdateFPTask(true);
  }

  /*//Handle Delete
  function handleDelete(FPID, Project){
    setFetchedFProject(Project);
    setFetchedFPID(FPID);
    setOpenPopupDeleteFProject(true);
  }*/

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Fiverr Project Tasks</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/fiverr/ManageFProjects")}
          sx={{ mt: -2, height: "40px" }}
        >
          Back
        </Button>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>

        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setOpenPopupAddFPTask(true) }}
            sx={{ mt: -2, height: "40px" }}
            disabled={!selectedProject || selectedProject.trim() === ""}
        >
             New Task
        </Button>
      </Box>

        <TextField
            id="outlined-basic"
            label="Select the Fiverr Project"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchTermChange}
            fullWidth
            margin="dense"
            style={{ width: "100%", marginInlineEnd: "10px", marginTop: "20px", marginBottom: "20px" }}
            InputLabelProps={{ style: { fontSize: "14px" } }} // Reduce font size of label
            inputProps={{
                style: {
                textAlign: "left",
                padding: "15px",
                fontSize: "17px", // Reduce font size of input text
                lineHeight: "1.4", // Vertically center the text
                },
                type: "search", // Change the type attribute
            }}
        />

        {/* Dropdown suggestions */}
        {showDropdown && (
            <Paper
                ref={tableRef}
                style={{
                    position: "absolute",
                    width: "30%",
                    marginTop: "10px",
                    borderRadius:"10px",
                    zIndex: 1,
                }}
                >
                <List>
                    {filteredFProjects.map((project) => (
                    <ListItem
                        key={project.id}
                        button
                        onClick={() => handleProjectClick(project)}
                    >
                        <ListItemText primary={project.projectName} />
                    </ListItem>
                    ))}
                </List>
            </Paper>
        )}

        <Box>
            <TasksTable 
                selectedProject={selectedProject} 
                selectedProjectTasks={selectedProjectTasks} 
                openPopupUpdateFPTask={openPopupUpdateFPTask}
                setOpenPopupUpdateFPTask={setOpenPopupUpdateFPTask}
                FPID = {fetchedFPID}
            />
        </Box>


      <AddFPTask openPopupAddFPTask={openPopupAddFPTask} setOpenPopupAddFPTask={setOpenPopupAddFPTask} FPID = {fetchedFPID} fetchedFPtasks = {selectedProjectTasks}></AddFPTask>
        {/*        <DeleteFProject openPopupDeleteFProject={openPopupDeleteFProject} setOpenPopupDeleteFProject={setOpenPopupDeleteFProject} FPID = {fetchedFPID} projectName = {fetchedFProject}></DeleteFProject>*/}

    </Box>
  );  
}
