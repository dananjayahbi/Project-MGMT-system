import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  CircularProgress,
  DialogTitle,
  Slide,
} from "@mui/material";
import axios from "axios";
import CustomTextField from "../../components/CustomTextField"
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
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
export default function UpdateFPTask(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupUpdateFPTask, setOpenPopupUpdateFPTask } = props;
  const [tasks, setTasks] = useState([]);
  const [targetTask, setTargetTask] = useState(null);
  //console.log(props)

  const apiUrl = `http://localhost:8070/fiverrProjects/updateFiverrProject/${props.FPID}`; // Change to your API URL

    useEffect(() =>{
        
        if(props.selectedProjectTasks != null){
            setTasks(props.selectedProjectTasks);
            setTargetTask(props.targetTask);
            //console.log(targetTask)
        }
    }, [props, openPopupUpdateFPTask]);

const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedTask = {
        taskID: values.taskID,
        taskName: values.taskName,
        description: values.description,
        taskGroupNo: values.taskGroupNo,
        status: values.status,
        notes: values.notes,
      };
  
      // Find the index of the task with the matching taskID
      const taskIndex = tasks.findIndex((task) => task._id === props.TID);
  
      if (taskIndex !== -1) {
        // If a task with the matching taskID is found, update it
        tasks[taskIndex] = updatedTask;
  
        // Send the updated tasks array to the server
        await axios.put(apiUrl, { tasks });
  
        sessionStorage.setItem("FPTaskUpdated", "1");
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
      setOpenPopupUpdateFPTask(false);
    }
  };  

  return (
    <Dialog
      open={openPopupUpdateFPTask}
      onBackdropClick={() => setOpenPopupUpdateFPTask(false)}
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
          style: { borderRadius: 10, width: "80%", pUpdateing: "20px", pUpdateingBottom: "30px"},
      }}
    >
      <div className="popup">
        <DialogTitle>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <p className="popupTitle">Update Task</p>
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
                taskID: props.targetTask?.taskID,
                taskName: targetTask?.taskName|| "",
                taskGroupNo: targetTask?.taskGroupNo|| "",
                status: targetTask?.status|| "",
                description: targetTask?.description|| "",
                notes: targetTask?.notes|| "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
            <Form>
              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="taskID" label="Task ID" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="taskName" label="Task Name" />
              </Grid>
              
              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="taskGroupNo" label="Task Group No" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="status" label="Status" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="description" label="Description"  multiline rows={6} />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="notes" label="Notes"  multiline rows={6} />
              </Grid>


              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupUpdateFPTask(false);
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
                  startIcon={<AddIcon />}
                >
                  Update
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
