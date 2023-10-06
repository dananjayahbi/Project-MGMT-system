import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
  ProjectCategory: '',
  projectBudget: "",
  notes: "",
  status: "",
  projectManagers: [],
  teamMembers: [],
};

const validationSchema = Yup.object({
  projectName: Yup.string().nullable().required("Project name is required"),
  description: Yup.string().nullable().required("Description is required"),
  projectBudget: Yup.number().nullable()
    .required("Project budget is required")
    .min(0, "Project budget cannot be negative")
    .positive("Project budget must be a positive number"),
  startDate: Yup.date().nullable().required("Start date is required"),
  deadline: Yup.date().nullable().required("Deadline is required"),
  priority: Yup.string().nullable().required("Priority is required"),
  ProjectCategory: Yup.string().nullable().required("ProjectCategory is required"),
  status: Yup.string().nullable().required("Status is required"),
  projectManagers: Yup.array().nullable()
    .min(1, "At least one project manager is required")
    .required("Project managers are required"),
  teamMembers: Yup.array().nullable().min(1, "At least one team member is required"),
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
  const [FPCategory,setFPCategory] = useState([]);

  const priority = ["High", "Medium", "Low"];
  const status = ["Requested", "Processing", "Reviewing", "Completed", "Cancelled"];

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
  
  //Fetch all categories
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch('http://localhost:8070/FPCategories/getAllFPCategories/');
        const data = await response.json();
        const categNames = data.map(categoryName => categoryName.categoryName);
        setFPCategory(categNames);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    }

    fetchCategory();
  }, [props, openPopupAddFProject]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Handle form submission
      await axios.post(apiUrl, values);
      sessionStorage.setItem("FProjectCreated", "1");
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
                        <MenuItem value="">Select the priority</MenuItem>
                        {priority.map((prio) => (
                          <MenuItem key={prio} value={prio}>
                            {prio}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>

                  {FPCategory.length > 0 && (
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="projectCategory">Category</InputLabel>
                        <Field
                          as={Select}
                          name="ProjectCategory"
                          label="Category"
                          inputProps={{ id: "projectCategory" }}
                        >
                          {FPCategory.map((categ) => (
                            <MenuItem key={categ} value={categ}>
                              {categ}
                            </MenuItem>
                          ))}
                        </Field>
                      </FormControl>
                    </Grid>
                  )}

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
                        <MenuItem value="">Select the Status</MenuItem>
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