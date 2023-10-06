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
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddFPCategory from "./AddFPCategory";
import UpdateFPCategory from "./UpdateFPCategory";
import DeleteFPCategory from "./DeleteFPCategory";

export default function CCProjectCategories() {
  const [FPCategories, setFPCategories] = useState([]);
  const [filteredFPCategories, setFilteredFPCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddFPCategory, setOpenPopupAddFPCategory] = useState(false); //Popup for NewBrand
  const [openPopupUpdateFPCategory, setOpenPopupUpdateFPCategory] = useState(false); //Popup for UpdateBrand
  const [openPopupDeleteFPCategory, setOpenPopupDeleteFPCategory] = useState(false); //Popup for DeleteBrand
  const [fetchedFPCategory, setFetchedFPCategory] = useState(null); //for delete functionality
  const [fetchedFPCID, setFetchedFPCID] = useState(null);
  const tableRef = useRef(null);

  
  //Fetch All FP Categories
  useEffect(() => {
    const fetchFPCategories= async () => {
      try {
        const response = await fetch("http://localhost:8070/FPCategories/getAllFPCategories/");
        const data = await response.json();
        setFPCategories(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchFPCategories();
  }, [openPopupAddFPCategory, openPopupUpdateFPCategory, openPopupDeleteFPCategory]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = FPCategories.filter((Category) => 
      (Category.categoryName && Category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredFPCategories(filtered);
  }, [FPCategories, searchTerm]);


  //Handle Update
  function handleUpdate(FPCID){
    setFetchedFPCID(FPCID);
    setOpenPopupUpdateFPCategory(true);
  }

  //Handle Delete
  function handleDelete(FPCID, Category){
    setFetchedFPCategory(Category);
    setFetchedFPCID(FPCID);
    setOpenPopupDeleteFPCategory(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Fiverr Project Categories</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
      <TextField
        id="outlined-basic"
        label="Search by Category name"
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
          onClick={() => {setOpenPopupAddFPCategory(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          Add Category
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Category name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredFPCategories.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
                filteredFPCategories.map((Catrgory) => (
                <TableRow key={Catrgory._id}>
                  <TableCell>{Catrgory.categoryName}</TableCell>
                  <TableCell>{Catrgory.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(Catrgory._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(Catrgory._id, Catrgory.categoryName)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Categories : {filteredFPCategories.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddFPCategory openPopupAddFPCategory={openPopupAddFPCategory} setOpenPopupAddFPCategory={setOpenPopupAddFPCategory}></AddFPCategory>
      <UpdateFPCategory openPopupUpdateFPCategory={openPopupUpdateFPCategory} setOpenPopupUpdateFPCategory={setOpenPopupUpdateFPCategory} FPCID = {fetchedFPCID}></UpdateFPCategory>
      <DeleteFPCategory openPopupDeleteFPCategory={openPopupDeleteFPCategory} setOpenPopupDeleteFPCategory={setOpenPopupDeleteFPCategory} FPCID = {fetchedFPCID} categoryName = {fetchedFPCategory}></DeleteFPCategory>

    </Box>
  );  
}
