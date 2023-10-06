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
  Box,
  CircularProgress,
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
import CustomTextField from "../../components/CustomTextField"
import ClearIcon from "@mui/icons-material/Clear";
import LoopIcon from '@mui/icons-material/Loop';
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import StartDatePicker from "../../components/StartDatePicker";
import DeadlinePicker from "../../components/DeadlinePicker";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

//YUP validations
const validationSchema = Yup.object({
 // categoryName: Yup.string().required("Category Name is required"),
 // description: Yup.string().required("Description is required"),
});

//The Main function
export default function UpdateCCProject(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const apiUrl = `http://localhost:8070/CCProjects/updateCCProject/${props.CCPID}`; // Change to your API URL

  const navigate = useNavigate();
  const { openPopupUpdateCCProject, setOpenPopupUpdateCCProject } = props;
  const [fetchedCCProjectData, setFetchedCCProjectData] = useState();
  const [loading, setLoading] = useState(true);
  const [projectManagers, setProjectManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [CCPCategory,setCCPCategory] = useState([]);

  const formattedStartDate = fetchedCCProjectData?.startDate
  ? new Date(fetchedCCProjectData.startDate).toISOString().split('T')[0]
  : '';

  const formattedDeadline = fetchedCCProjectData?.deadline
  ? new Date(fetchedCCProjectData.deadline).toISOString().split('T')[0]
  : '';

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

  
    async function getCCProject() {
        setLoading(true);
        await axios
            .get(`http://localhost:8070/CCProjects/getCCProject/${props.CCPID}`)
            .then((res) => {
                setFetchedCCProjectData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() =>{
        if (props.CCPID != null){
            getCCProject();
        }
    }, [props, openPopupUpdateCCProject]);

    //Fetch all categories
    useEffect(() => {
        async function fetchCategory() {
        try {
            const response = await fetch('http://localhost:8070/CCPCategories/getAllCCPCategories/');
            const data = await response.json();
            const categNames = data.map(categoryName => categoryName.categoryName);
            setCCPCategory(categNames);
        } catch (error) {
            console.error('Error fetching:', error);
        }
        }

        fetchCategory();
    }, [props, openPopupUpdateCCProject]);


    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        const dataToSend = {
          projectName: values.projectName,
          description: values.description,
          startDate: values.startDate,
          deadline: values.deadline,
          priority: values.priority,
          projectManagers: values.projectManagers,
          teamMembers: values.teamMembers,
          ProjectCategory: values.ProjectCategory,
          projectBudget: values.projectBudget,
          attachments: values.attachments,
          status: values.status,
          notes: values.notes,
        };
  
        await axios.put(apiUrl, dataToSend);
        sessionStorage.setItem("CCProjectUpdated", "1");
        navigate("/codecannyon/ManageCCProjects");
      } catch (error) {
        setNotify({
          isOpen: true,
          message: err.response.data.errorMessage,
          type: "error",
        });
      } finally {
        setSubmitting(false);
        setOpenPopupUpdateCCProject(false);
      }
    };

  return (
    <Dialog
      open={openPopupUpdateCCProject}
      onBackdropClick={() => setOpenPopupUpdateCCProject(false)}
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
            <p className="popupTitle">Update CodeCannyon Project</p>
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
                projectName: fetchedCCProjectData?.projectName || "",
                description: fetchedCCProjectData?.description || "",
                startDate: formattedStartDate || "",
                deadline: formattedDeadline|| "",
                priority: fetchedCCProjectData?.priority || "",
                projectManagers: fetchedCCProjectData?.projectManagers || [],
                teamMembers: fetchedCCProjectData?.teamMembers || [],
                ProjectCategory: fetchedCCProjectData?.ProjectCategory || "",
                projectBudget: fetchedCCProjectData?.projectBudget || "",
                attachments: fetchedCCProjectData?.attachments || [],
                status: fetchedCCProjectData?.status || "",
                notes: fetchedCCProjectData?.notes || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
            <Form style={{marginTop:"5px"}}>
                <Grid container spacing={3}>
                    <Grid item xs={6} style={{ marginBottom: "10px", marginTop: "10px" }}>
                        <CustomTextField name="projectName" label="Project Name" />
                    </Grid>

                    <Grid item xs={3}>
                        <StartDatePicker name="startDate" value={values.startDate}/>
                    </Grid>

                    <Grid item xs={3}>
                        <DeadlinePicker name="deadline" value={values.deadline}/>
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

                        {CCPCategory.length > 0 && (
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="projectCategory">Category</InputLabel>
                                <Field
                                    as={Select}
                                    name="ProjectCategory"
                                    label="Category"
                                    inputProps={{ id: "projectCategory" }}
                                >
                                    {CCPCategory.map((categ) => (
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
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupUpdateCCProject(false);
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
