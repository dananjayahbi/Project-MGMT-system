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
import AddCCProject from "./AddCCProject";
//import UpdateFPProject from "./UpdateCCProject";
//import DeleteCCProject from "./DeleteCCProject";

export default function ManageCCProjects() {
  const [CCProjects, setCCProjects] = useState([]);
  const [filteredCCProjects, setFilteredCCProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddCCProject, setOpenPopupAddCCProject] = useState(false); 
  const [openPopupUpdateCCProject, setOpenPopupUpdateCCProject] = useState(false);
  const [openPopupDeleteCCProject, setOpenPopupDeleteCCProject] = useState(false);
  const [fetchedCCPID, setFetchedCCPID] = useState(null);
  const [fetchedCCProject, setFetchedCCProject] = useState(null); //for delete functionality
  const tableRef = useRef(null);

  
  //Fetch All Fiverr Projects
  useEffect(() => {
    const fetchCCProjects = async () => {
      try {
        const response = await fetch("http://localhost:8070/CCProjects/getAllCCProjects");
        const data = await response.json();
        setCCProjects(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchCCProjects();
  }, [openPopupAddCCProject, openPopupUpdateCCProject, openPopupDeleteCCProject]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = CCProjects.filter((CCProjects) => 
      (CCProjects.projectName && CCProjects.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCCProjects(filtered);
  }, [CCProjects, searchTerm]);


  //Handle Update
  function handleUpdate(CCPID){
    setFetchedCCPID(CCPID);
    setOpenPopupUpdateCCProject(true);
  }

  //Handle Delete
  function handleDelete(CCPID, Project){
    setFetchedCCProject(Project);
    setFetchedCCPID(CCPID);
    setOpenPopupDeleteCCProject(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">CodeCannyon Projects</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

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
          onClick={() => {setOpenPopupAddCCProject(true)}}
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
            ) : filteredCCProjects.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredCCProjects.map((Project) => (
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
                Total Projects : {filteredCCProjects.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddCCProject openPopupAddCCProject={openPopupAddCCProject} setOpenPopupAddCCProject={setOpenPopupAddCCProject}></AddCCProject>
      {/*<UpdateFPProject openPopupUpdateCCProject={openPopupUpdateCCProject} setOpenPopupUpdateCCProject={setOpenPopupUpdateCCProject} CCPID = {fetchedCCPID}></UpdateFPProject>
                  <DeleteCCProject openPopupDeleteCCProject={openPopupDeleteCCProject} setOpenPopupDeleteCCProject={setOpenPopupDeleteCCProject} CCPID = {fetchedCCPID} projectName = {fetchedCCProject}></DeleteCCProject>*/}

    </Box>
  );  
}
