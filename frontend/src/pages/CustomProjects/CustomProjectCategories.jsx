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
import AddCustPCategory from "./AddCustomProjectCategory";
import UpdateCustPCategory from "./UpdateCustomProjectCategory";
import DeleteCustPCategory from "./DeleteCustomProjectCategory";

export default function CustomProjectCategories() {
  const [CustPCategories, setCustPCategories] = useState([]);
  const [filteredCustPCategories, setFilteredCustPCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddCustPCategory, setOpenPopupAddCustPCategory] = useState(false); //Popup for NewBrand
  const [openPopupUpdateCustPCategory, setOpenPopupUpdateCustPCategory] = useState(false); //Popup for UpdateBrand
  const [openPopupDeleteCustPCategory, setOpenPopupDeleteCustPCategory] = useState(false); //Popup for DeleteBrand
  const [fetchedCustPCategory, setFetchedCustPCategory] = useState(null); //for delete functionality
  const [fetchedCUPCID, setFetchedCUPCID] = useState(null);
  const tableRef = useRef(null);

  
  //Fetch All Cust P Categories
  useEffect(() => {
    const fetchCustPCategories= async () => {
      try {
        const response = await fetch("http://localhost:8070/CustPCategories/getAllCustPCategories/");
        const data = await response.json();
        setCustPCategories(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchCustPCategories();
  }, [openPopupAddCustPCategory, openPopupUpdateCustPCategory, openPopupDeleteCustPCategory]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = CustPCategories.filter((Category) => 
      (Category.categoryName && Category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCustPCategories(filtered);
  }, [CustPCategories, searchTerm]);


  //Handle Update
  function handleUpdate(CUPCID){
    setFetchedCUPCID(CUPCID);
    setOpenPopupUpdateCustPCategory(true);
  }

  //Handle Delete
  function handleDelete(CUPCID, Category){
    setFetchedCustPCategory(Category);
    setFetchedCUPCID(CUPCID);
    setOpenPopupDeleteCustPCategory(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Custom Project Categories</Typography>
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
          onClick={() => {setOpenPopupAddCustPCategory(true)}}
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
            ) : filteredCustPCategories.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
                filteredCustPCategories.map((Catrgory) => (
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
                Total Categories : {filteredCustPCategories.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddCustPCategory openPopupAddCustPCategory={openPopupAddCustPCategory} setOpenPopupAddCustPCategory={setOpenPopupAddCustPCategory}></AddCustPCategory>
      <UpdateCustPCategory openPopupUpdateCustPCategory={openPopupUpdateCustPCategory} setOpenPopupUpdateCustPCategory={setOpenPopupUpdateCustPCategory} CUPCID = {fetchedCUPCID}></UpdateCustPCategory>
      <DeleteCustPCategory openPopupDeleteCustPCategory={openPopupDeleteCustPCategory} setOpenPopupDeleteCustPCategory={setOpenPopupDeleteCustPCategory} CUPCID = {fetchedCUPCID} categoryName = {fetchedCustPCategory}></DeleteCustPCategory>

    </Box>
  );  
}
