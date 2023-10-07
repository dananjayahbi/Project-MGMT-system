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
import AddCustProject from "./AddCustomProject";
import UpdateFPProject from "./UpdateCustomProject";
import DeleteCustProject from "./DeleteCustomProject";

export default function ManageCustProjects() {
  const [CustProjects, setCustProjects] = useState([]);
  const [filteredCustProjects, setFilteredCustProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddCustProject, setOpenPopupAddCustProject] = useState(false); 
  const [openPopupUpdateCustProject, setOpenPopupUpdateCustProject] = useState(false);
  const [openPopupDeleteCustProject, setOpenPopupDeleteCustProject] = useState(false);
  const [fetchedCUPID, setFetchedCUPID] = useState(null);
  const [fetchedCustProject, setFetchedCustProject] = useState(null); //for delete functionality
  const tableRef = useRef(null);

  
  //Fetch All Fiverr Projects
  useEffect(() => {
    const fetchCustProjects = async () => {
      try {
        const response = await fetch("http://localhost:8070/CustomProjects/getAllCustomProjects");
        const data = await response.json();
        setCustProjects(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchCustProjects();
  }, [openPopupAddCustProject, openPopupUpdateCustProject, openPopupDeleteCustProject]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = CustProjects.filter((CustProjects) => 
      (CustProjects.projectName && CustProjects.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCustProjects(filtered);
  }, [CustProjects, searchTerm]);


  //Handle Update
  function handleUpdate(CUPID){
    setFetchedCUPID(CUPID);
    setOpenPopupUpdateCustProject(true);
  }

  //Handle Delete
  function handleDelete(CUPID, Project){
    setFetchedCustProject(Project);
    setFetchedCUPID(CUPID);
    setOpenPopupDeleteCustProject(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Custom Projects</Typography>
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
          onClick={() => {setOpenPopupAddCustProject(true)}}
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
            ) : filteredCustProjects.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustProjects.map((Project) => (
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
                Total Projects : {filteredCustProjects.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddCustProject openPopupAddCustProject={openPopupAddCustProject} setOpenPopupAddCustProject={setOpenPopupAddCustProject}></AddCustProject>
      <UpdateFPProject openPopupUpdateCustProject={openPopupUpdateCustProject} setOpenPopupUpdateCustProject={setOpenPopupUpdateCustProject} CUPID = {fetchedCUPID}></UpdateFPProject>
      <DeleteCustProject openPopupDeleteCustProject={openPopupDeleteCustProject} setOpenPopupDeleteCustProject={setOpenPopupDeleteCustProject} CUPID = {fetchedCUPID} projectName = {fetchedCustProject}></DeleteCustProject>

    </Box>
  );  
}
