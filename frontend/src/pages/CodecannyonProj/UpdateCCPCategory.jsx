import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Box,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import CustomTextField from "../../components/CustomTextField"
import ClearIcon from "@mui/icons-material/Clear";
import LoopIcon from '@mui/icons-material/Loop';
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

//YUP validations
const validationSchema = Yup.object({
  categoryName: Yup.string().required("Category Name is required"),
  description: Yup.string().required("Description is required"),
});

//The Main function
export default function UpdateCCPCategory(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const apiUrl = `http://localhost:8070/CCPCategories/updateCCPCategory/${props.CCPCID}`; // Change to your API URL

  const navigate = useNavigate();
  const { openPopupUpdateCCPCategory, setOpenPopupUpdateCCPCategory } = props;
  const [fetchedCCPCategoryData, setFetchedCCPCategoryData] = useState();
  const [loading, setLoading] = useState(true);
  
    async function getCCPCategory() {
        setLoading(true);
        await axios
            .get(`http://localhost:8070/CCPCategories/getCCPCategory/${props.CCPCID}`)
            .then((res) => {
                setFetchedCCPCategoryData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() =>{
        if (props.CCPCID != null){
            getCCPCategory();
        }
    }, [props, openPopupUpdateCCPCategory]);


    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        const dataToSend = {
          categoryName: values.categoryName,
          description: values.description,
        };
  
        await axios.put(apiUrl, dataToSend);
        sessionStorage.setItem("CCPCategoryUpdated", "1");
        navigate("/codecannyon/CCPCategories");
      } catch (error) {
        setNotify({
          isOpen: true,
          message: err.response.data.errorMessage,
          type: "error",
        });
      } finally {
        setSubmitting(false);
        setOpenPopupUpdateCCPCategory(false);
      }
    };

  return (
    <Dialog
      open={openPopupUpdateCCPCategory}
      onBackdropClick={() => setOpenPopupUpdateCCPCategory(false)}
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
          style: { borderRadius: 10, width: "80%", padding: "20px", paddingBottom: "30px"},
      }}
    >
      <div className="popup">
        <DialogTitle>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <p className="popupTitle">Update Fiverr Project Category</p>
          </div>
        </div>

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />

          <Divider
            sx={{
              height: "1px",
              backgroundColor: "var(--dark)",
              marginTop: "10px",
            }}
          />
        </DialogTitle>

        <DialogContent>
        {loading ? (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        ) : (
          <Formik
            initialValues={{
                categoryName: fetchedCCPCategoryData?.categoryName || "",
                description: fetchedCCPCategoryData?.description || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
            <Form>
              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="categoryName" label="Category Name" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="description" label="Description" />
              </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupUpdateCCPCategory(false);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Close
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<LoopIcon />}
                >
                  Update
                </Button>
              </div>
            </Form>
            )}
          </Formik>
        )}
        </DialogContent>
      </div>
    </Dialog>
  );
}
