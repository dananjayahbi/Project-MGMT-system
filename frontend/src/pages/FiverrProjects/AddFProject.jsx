import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import * as Yup from "yup";
import dayjs from 'dayjs';
import {
  Button,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Input,
  Chip
} from "@mui/material";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import CustomTextField from "../../components/CustomTextField"
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import StartDatePicker from "../../components/StartDatePicker";
import DeadlinePicker from "../../components/DeadlinePicker";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const apiUrl = "http://localhost:8070/fiverrProjects/addFiverrProject"; // Change to your API URL

const INITIAL_FORM_STATE = {
  projectName: "",
  description: "",
  startDate: "",
  deadline: "",
  priority: "",
  projectCategory: "",
  projectBudget: "",
  notes: "",
  status: "",
  projectManagers: [],
  teamMembers: [],
};

const validationSchema = Yup.object({
  projectName: Yup.string().required("Project name is required"),
  description: Yup.string().required("Description is required"),
  // Add validation for other fields
});

export default function AddFProject(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupAddFProject, setOpenPopupAddFProject } = props;

  const [projectManagers, setProjectManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const priority = ["High", "Medium", "Low"];
  const status = ["Requested", "Processing", "Reviewing", "Completed", "Cancelled"];
  const today = dayjs();

  useEffect(() => {
    // Fetch all users
    axios.get("http://localhost:8070/users/getAllUsers")
      .then((response) => {
        const users = response.data;
  
        // Filter project managers and save only their usernames
        const projectManagersUsernames = users
          .filter(user => user.role === "Project Manager")
          .map(user => user.username);
  
        // Filter team members (Full-time and Part-time employees) and save only their usernames
        const teamMembersUsernames = users
          .filter(user => user.role === "Full-time-employee" || user.role === "Part-time-employee")
          .map(user => user.username);
  
        setProjectManagers(projectManagersUsernames);
        setTeamMembers(teamMembersUsernames);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Handle form submission
      await axios.post(apiUrl, values);
      sessionStorage.setItem("projectCreated", "1");
      navigate("/fiverr/ManageFProjects");
    } catch (error) {
      setNotify({
        isOpen: true,
        message: error.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopupAddFProject(false);
    }
  };

  return (
    <Dialog
      open={openPopupAddFProject}
      onBackdropClick={() => setOpenPopupAddFProject(false)}
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
        style: { borderRadius: 10, width: "80%", padding: "20px", paddingBottom: "30px" },
      }}
    >
      <div className="popup">
        <DialogTitle>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <p className="popupTitle">Add Fiverr Project</p>
            </div>
          </div>

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
            initialValues={INITIAL_FORM_STATE}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form style={{marginTop:"5px"}}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <CustomTextField name="projectName" label="Project Name" />
                  </Grid>
                  <Grid item xs={3}>
                        <StartDatePicker name="startDate" />
                  </Grid>
                  <Grid item xs={3}>
                        <DeadlinePicker name="deadline" />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="priority">Priority</InputLabel>
                      <Field
                        as={Select}
                        name="priority"
                        label="Priority"
                        inputProps={{ id: "priority" }}
                      >
                        {priority.map((prio) => (
                          <MenuItem key={prio} value={prio}>
                            {prio}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField name="ProjectCategory" label="Project Category" />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField name="projectBudget" label="Project Budget" />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="status">Status</InputLabel>
                      <Field
                        as={Select}
                        name="status"
                        label="status"
                        inputProps={{ id: "status" }}
                      >
                        {status.map((stat) => (
                          <MenuItem key={stat} value={stat}>
                            {stat}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField name="attachments" label="Attachments" multiline rows={4} />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField name="description" label="Description" multiline rows={4} />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField name="notes" label="Notes" multiline rows={4} />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Asign Project Managers</InputLabel>
                      <Field
                        name="projectManagers"
                        as={Select}
                        multiple
                        input={<Input />}
                        renderValue={(selected) => (
                          <div
                            style={{
                              maxHeight: '100px', // Adjust the maximum height as needed
                              overflowY: 'auto',   // Add vertical scrollbar when content overflows
                            }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </div>
                        )}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Adjust the maximum height as needed
                            },
                          },
                        }}
                        autoWidth={false} // Disable auto width
                        displayEmpty={false} // Remove empty value placeholder
                      >
                        {projectManagers.map((manager) => (
                          <MenuItem key={manager} value={manager}>
                            <Checkbox
                              checked={values.projectManagers.indexOf(manager) > -1}
                            />
                            <ListItemText primary={manager} />
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Make a Team</InputLabel>
                      <Field
                        name="teamMembers"
                        as={Select}
                        multiple
                        input={<Input />}
                        renderValue={(selected) => (
                          <div
                            style={{
                              maxHeight: '100px', // Adjust the maximum height as needed
                              overflowY: 'auto',   // Add vertical scrollbar when content overflows
                            }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </div>
                        )}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Adjust the maximum height as needed
                            },
                          },
                        }}
                        autoWidth={false} // Disable auto width
                        displayEmpty={false} // Remove empty value placeholder
                      >
                        {teamMembers.map((member) => (
                          <MenuItem key={member} value={member}>
                            <Checkbox
                              checked={values.teamMembers.indexOf(member) > -1}
                            />
                            <ListItemText primary={member} />
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>
                </Grid>

                <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                  <Button
                    startIcon={<ClearIcon />}
                    style={{ marginRight: "15px" }}
                    onClick={() => {
                      setOpenPopupAddFProject(false);
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
                    Add
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