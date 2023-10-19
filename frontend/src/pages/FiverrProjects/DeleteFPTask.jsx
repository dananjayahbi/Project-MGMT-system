import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

//YUP validations
const validationSchema = Yup.object({
    //TaskName: Yup.string().required("Task name is required"),
    //description: Yup.string().required("Description is required"),
});  

//The Main function
export default function DeleteFPTask(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupDeleteFPTask, setOpenPopupDeleteFPTask } = props;
  const [tasks, setTasks] = useState([]);
  const [targetTaskD, setTargetTaskD] = useState(null);

  const apiUrl = `http://localhost:8070/fiverrProjects/updateFiverrProject/${props.FPID}`; // Change to your API URL

    useEffect(() =>{
        
        if(props.selectedProjectTasks != null){
            setTasks(props.selectedProjectTasks);
            setTargetTaskD(props.targetTaskD);
        }
    }, [props, openPopupDeleteFPTask]);

const handleSubmit = async (values, { setSubmitting }) => {
    try {
  
      // Find the index of the task with the matching taskID
      const taskIndex = tasks.findIndex((task) => task._id === props.TID);
  
      if (taskIndex !== -1) {
        // Remove the task from the tasks array using splice
        tasks.splice(taskIndex, 1);

        console.log(taskIndex)
  
        // Send the updated tasks array to the server
        await axios.put(apiUrl, { tasks });
  
        sessionStorage.setItem("FPTaskDeleted", "1");
        navigate("/fiverr/ManageFPTasks");
      } else {
        // Handle the case where the task with the given taskID is not found
        throw new Error("Task not found");
      }
    } catch (error) {
      setNotify({
        isOpen: true,
        message: error.response?.data?.errorMessage || "An error occurred",
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopupDeleteFPTask(false);
    }
  };  

  return (
    <Dialog
      open={openPopupDeleteFPTask}
      onBackdropClick={() => setOpenPopupDeleteFPTask(false)}
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
          style: { borderRadius: 10, width: "80%", pUpdateing: "20px", pUpdateingBottom: "30px"},
      }}
    >
      <div className="popup">
        <DialogTitle>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <p className="popupTitle">Confirm delete task?</p>
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
          <Formik
            initialValues={{
                taskName: targetTaskD?.taskName|| "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
            <Form>
              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupDeleteFPTask(false);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </div>
            </Form>
            )}
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
}
