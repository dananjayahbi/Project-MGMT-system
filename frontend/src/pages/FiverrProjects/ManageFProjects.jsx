import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress, // Added for loading animation
  Typography,
  Divider,
  Chip,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import TaskIcon from '@mui/icons-material/Task';
import { useNavigate } from "react-router-dom";
import AddFProject from "./AddFProject";
import UpdateFPProject from "./UpdateFProject";
import DeleteFProject from "./DeleteFProject";

export default function ManageFProjects() {
  const [FProjects, setFProjects] = useState([]);
  const [filteredFProjects, setFilteredFProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddFProject, setOpenPopupAddFProject] = useState(false); 
  const [openPopupUpdateFProject, setOpenPopupUpdateFProject] = useState(false);
  const [openPopupDeleteFProject, setOpenPopupDeleteFProject] = useState(false);
  const [fetchedFPID, setFetchedFPID] = useState(null);
  const [fetchedFProject, setFetchedFProject] = useState(null); //for delete functionality
  const tableRef = useRef(null);
  const navigate = useNavigate();

  
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
  }, [openPopupAddFProject, openPopupUpdateFProject, openPopupDeleteFProject]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = FProjects.filter((fProjects) => 
      (fProjects.projectName && fProjects.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredFProjects(filtered);
  }, [FProjects, searchTerm]);


  //Handle Update
  function handleUpdate(FPID){
    setFetchedFPID(FPID);
    setOpenPopupUpdateFProject(true);
  }

  //Handle Delete
  function handleDelete(FPID, Project){
    setFetchedFProject(Project);
    setFetchedFPID(FPID);
    setOpenPopupDeleteFProject(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Fiverr Projects</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Button
        variant="contained"
        startIcon={<TaskIcon />}
        onClick={() => navigate("/fiverr/ManageFPTasks")}
        sx={{ mt: -2, height: "40px" }}
      >
        Task Manager
      </Button>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
        <TextField
          id="outlined-basic"
          label="Search by Project Name"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchTermChange}
          fullWidth
          margin="dense"
          style={{ width: "30%", marginInlineEnd: "10px", marginTop: "-20px", paddingTop: "5px" }}
          InputLabelProps={{ style: { fontSize: "14px" } }} // Reduce font size of label
          inputProps={{
            style: {
              textAlign: "left",
              padding: "10px",
              fontSize: "14px", // Reduce font size of input text
              lineHeight: "1.4", // Vertically center the text
            },
            type: "search", // Change the type attribute
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {setOpenPopupAddFProject(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          New Project
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Project ID</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredFProjects.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredFProjects.map((Project) => (
                <TableRow key={Project._id}>
                  <TableCell>{Project.PID}</TableCell>
                  <TableCell>{Project.projectName}</TableCell>
                  <TableCell>{Project.description}</TableCell>
                  <TableCell>{Project.priority}</TableCell>
                  <TableCell>
                    {(() => {
                      const statusColors = {
                        requested: 'primary',
                        processing: 'warning', 
                        reviewing: 'info', 
                        cnacelled: 'warning', 
                        completed: 'success', 
                      };

                      const color = statusColors[Project.status.toLowerCase()];

                      return color ? (
                        <Chip label={Project.status} color={color} />
                      ) : (
                        <Chip label={Project.status} color="error" />
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(Project._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(Project._id, Project.projectName)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Projects : {filteredFProjects.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddFProject openPopupAddFProject={openPopupAddFProject} setOpenPopupAddFProject={setOpenPopupAddFProject}></AddFProject>
      <UpdateFPProject openPopupUpdateFProject={openPopupUpdateFProject} setOpenPopupUpdateFProject={setOpenPopupUpdateFProject} FPID = {fetchedFPID}></UpdateFPProject>
      <DeleteFProject openPopupDeleteFProject={openPopupDeleteFProject} setOpenPopupDeleteFProject={setOpenPopupDeleteFProject} FPID = {fetchedFPID} projectName = {fetchedFProject}></DeleteFProject>

    </Box>
  );  
}
