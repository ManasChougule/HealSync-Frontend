import React, { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { Delete, Edit, CheckCircle, Cancel, AccessTime, Help, Logout, ArrowBack } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminHome() {
  const navigate = useNavigate();
  // Ensure all list states are initialized to empty arrays
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecialization] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalCity, setHospitalCity] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [specializationName, setSpecializationName] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null); // Initialize to null, but handle carefully
  const [selectedSpecialization, setSelectedSpecialization] = useState(null); // Initialize to null, but handle carefully
  const [openHospitalDialog, setOpenHospitalDialog] = useState(false);
  const [openSpecializationDialog, setOpenSpecializationDialog] = useState(false);

  // States for Ambulance management (ONLY for adding)
  const [ambulanceContactNumber, setAmbulanceContactNumber] = useState("");
  const [ambulanceDriverName, setAmbulanceDriverName] = useState("");
  const [ambulanceRegistrationNumber, setAmbulanceRegistrationNumber] = useState("");
  const [ambulanceStatus, setAmbulanceStatus] = useState("");

  // Helper function to safely get array data from API response
  // Added more robust checks and logging
  const getArrayFromResponse = (data, endpointName = "unknown") => {
    if (data === null || data === undefined) {
      console.warn(`[${endpointName}] API response data was NULL or UNDEFINED. Returning empty array.`);
      return [];
    }
    if (!Array.isArray(data)) {
      console.warn(`[${endpointName}] API response data was NOT an array. Type: ${typeof data}. Value:`, data, `. Returning empty array.`);
      return [];
    }
    return data;
  };

  // Load users (doctors and patients)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/registration/all?role=ADMIN");
        console.log("[Users Fetch] Raw API response data:", response.data); // Debugging log
        const allUsers = getArrayFromResponse(response.data, "users");

        // Ensure allUsers is an array before filtering
        if (Array.isArray(allUsers)) {
          setDoctors(allUsers.filter((user) => user.role === "DOCTOR"));
          setPatients(allUsers.filter((user) => user.role === "PATIENT"));
          setUsers(allUsers); // Update the general users state too if needed elsewhere
        } else {
          console.error("[Users Fetch] getArrayFromResponse returned non-array for users.");
          setDoctors([]);
          setPatients([]);
          setUsers([]);
        }
      } catch (error) {
        toast.error("Error fetching users");
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
        setDoctors([]);
        setPatients([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Load appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/registration/appointments?role=ADMIN");
        console.log("[Appointments Fetch] Raw API response data:", response.data); // Debugging log
        setAppointments(getArrayFromResponse(response.data, "appointments"));
      } catch (error) {
        toast.error("Error fetching appointments");
        console.error("Error fetching appointments:", error.response ? error.response.data : error.message);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Load hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:8080/hospitals/all");
        console.log("[Hospitals Fetch] Raw API response data:", response.data); // Debugging log
        setHospitals(getArrayFromResponse(response.data, "hospitals"));
      } catch (error) {
        toast.error("Error fetching hospitals");
        console.error("Error fetching hospitals:", error.response ? error.response.data : error.message);
        setHospitals([]);
      }
    };
    fetchHospitals();
  }, []);

  // Load specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/specializations/all");
        console.log("[Specializations Fetch] Raw API response data:", response.data); // Debugging log
        setSpecialization(getArrayFromResponse(response.data, "specializations"));
      } catch (error) {
        toast.error("Error fetching specializations");
        console.error("Error fetching specializations:", error.response ? error.response.data : error.message);
        setSpecialization([]);
      }
    };
    fetchSpecializations();
  }, []);

  // Removed: useEffect for fetching ambulances, as per "not fetching data of ambulances"

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/registration/update/${selectedUser.id}`, selectedUser);
      toast.success("User updated successfully!");
      // Re-fetch users to ensure lists are fully updated after an edit
      // Or, more efficiently, update the specific user in the state
      if (selectedUser.role === "DOCTOR") {
        setDoctors(doctors.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
      } else if (selectedUser.role === "PATIENT") {
        setPatients(patients.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
      }
      handleClose();
    } catch (error) {
      toast.error("Error updating user");
      console.error("Error updating user:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/registration/delete/${userId}`);
        toast.success("User deleted successfully!");
        setDoctors(doctors.filter((user) => user.id !== userId));
        setPatients(patients.filter((user) => user.id !== userId));
      } catch (error) {
        toast.error("Error deleting user");
        console.error("Error deleting user:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return <AccessTime color="warning" />;
      case "confirmed":
        return <CheckCircle color="success" />;
      case "cancelled":
        return <Cancel color="error" />;
      default:
        return <Help color="disabled" />;
    }
  };

  const renderUsers = (userList) => {
    console.log("[renderUsers] userList:", userList); // Debugging log
    return (
      <List>
        {Array.isArray(userList) && userList.map((user) => (
          <ListItem key={user.id} sx={styles.listItem}>
            <ListItemAvatar>
              <Avatar src={user.gender === "MALE" ? "/male.png" : "/female.png"} />
            </ListItemAvatar>
            <ListItemText
              primary={`${user.firstName || ''} ${user.lastName || ''}`} // Defensive access
              secondary={`${user.role || ''} | ${user.email || ''}`} // Defensive access
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
                <Edit />
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(user.id)}>
                <Delete />
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>
    );
  };

  const renderAppointments = () => {
    console.log("[renderAppointments] appointments:", appointments); // Debugging log
    return (
      <List>
        {Array.isArray(appointments) && appointments.map((appointment) => (
          <ListItem key={appointment.id} sx={styles.listItem}>
            <ListItemText
              primary={`Date: ${appointment.day || 'N/A'} at ${appointment.time || 'N/A'}`}
              secondary={`Doctor: ${appointment.doctor?.user?.firstName || 'N/A'} ${appointment.doctor?.user?.lastName || 'N/A'} | Patient: ${appointment.patient?.user?.firstName || 'N/A'} ${appointment.patient?.user?.lastName || 'N/A'}`}
            />
            <Chip
              icon={getStatusIcon(appointment.status)}
              label={appointment.status || "Unknown"}
              variant="outlined"
            />
          </ListItem>
        ))}
      </List>
    );
  };
  

  const handleHospitalSubmit = async (event) => {
    event.preventDefault();
    if (!hospitalName || !hospitalCity || !hospitalAddress) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/hospitals/add", { name: hospitalName, city: hospitalCity, address: hospitalAddress });
      toast.success("Hospital added successfully!");
      if (response.data) {
        setHospitals([...hospitals, response.data]);
      }
      setHospitalName("");
      setHospitalCity("");
      setHospitalAddress("");
    } catch (error) {
      toast.error("Error adding hospital");
      console.error("Error adding hospital:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationSubmit = async (event) => {
    event.preventDefault();
    if (!specializationName) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/specializations/add", { name: specializationName });
      toast.success("Specialization added successfully!");
      if (response.data) {
        setSpecialization([...specializations, response.data]);
      }
      setSpecializationName("");
    } catch (error) {
      toast.error("Error adding specialization");
      console.error("Error adding specialization:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSpecialization = (specialization) => {
    setSelectedSpecialization(specialization);
    setSpecializationName(specialization.name);
    setOpenSpecializationDialog(true);
  };

  const handleDeleteSpecialization = async (specializationId) => {
    if (window.confirm("Are you sure you want to delete this specialization?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/specializations/delete/${specializationId}`);
        toast.success("Specialization deleted successfully!");
        setSpecialization(specializations.filter((s) => s.id !== specializationId));
      } catch (error) {
        toast.error("Error deleting specialization");
        console.error("Error deleting specialization:", error.response ? error.response.data : error.message);
      } finally {
      setLoading(false);
      }
    }
  };

  const handleEditHospital = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalName(hospital.name);
    setHospitalCity(hospital.city);
    setHospitalAddress(hospital.address);
    setOpenHospitalDialog(true);
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/hospitals/delete/${hospitalId}`);
        toast.success("Hospital deleted successfully!");
        setHospitals(hospitals.filter((hospital) => hospital.id !== hospitalId));
      } catch (error) {
        toast.error("Error deleting hospital");
        console.error("Error deleting hospital:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitHospital = async () => {
    if (!hospitalName || !hospitalCity || !hospitalAddress) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const updatedHospital = { name: hospitalName, city: hospitalCity, address: hospitalAddress };
      await axios.put(`http://localhost:8080/hospitals/update/${selectedHospital.id}`, updatedHospital);
      toast.success("Hospital updated successfully!");
      setHospitals(hospitals.map((h) => (h.id === selectedHospital.id ? { ...h, ...updatedHospital } : h)));
      setOpenHospitalDialog(false);
    } catch (error) {
      toast.error("Error updating hospital");
      console.error("Error updating hospital:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSpecialization = async () => {
    if (!specializationName) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const updatedSpecialization = { name: specializationName };
      await axios.put(`http://localhost:8080/specializations/update/${selectedSpecialization.id}`, updatedSpecialization);
      toast.success("Specialization updated successfully!");
      setSpecialization(specializations.map((s) => (s.id === selectedSpecialization.id ? { ...s, ...updatedSpecialization } : s)));
      setOpenSpecializationDialog(false);
    } catch (error) {
      toast.error("Error updating specialization");
      console.error("Error updating specialization:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

const handleAddAmbulance = async (event) => {
  event.preventDefault();

  if (
    !ambulanceContactNumber ||
    !ambulanceDriverName ||
    !ambulanceRegistrationNumber ||
    !ambulanceStatus ||
    !ambulanceType
  ) {
    toast.error("Please fill all ambulance fields");
    return;
  }

  setLoading(true);

  const ambulanceData = {
    contactNumber: ambulanceContactNumber,
    driverName: ambulanceDriverName,
    vehicleNumber: ambulanceRegistrationNumber, // ✅ Correct field
    available: ambulanceStatus === "AVAILABLE", // ✅ Correct field as boolean
    type: ambulanceType,
  };

  try {
    await axios.post("http://localhost:8080/api/ambulances/add", ambulanceData);
    toast.success("Ambulance added successfully!");
    setAmbulanceContactNumber("");
    setAmbulanceDriverName("");
    setAmbulanceRegistrationNumber("");
    setAmbulanceStatus("");
    setAmbulanceType("");
  } catch (error) {
    console.error("Error adding ambulance:", error.response?.data || error.message);
    toast.error("Error adding ambulance. Please check the server logs for details.");
  } finally {
    setLoading(false);
  }
};




  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Admin Dashboard</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="primary" onClick={handleBack} startIcon={<ArrowBack />}>
              Back
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout} startIcon={<Logout />}>
              Logout
            </Button>
          </Stack>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)}>
            <Tab label="Doctors" />
            <Tab label="Patients" />
            <Tab label="Appointments" />
            <Tab label="Hospitals" />
            <Tab label="Add Hospital" />
            <Tab label="Specializations" />
            <Tab label="Add Specialization" />
            <Tab label="Add Ambulance" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {loading && <CircularProgress />}
            {activeTab === 0 && renderUsers(doctors)}
            {activeTab === 1 && renderUsers(patients)}
            {activeTab === 2 && renderAppointments()}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6">Hospitals</Typography>
                <List>
                  {/* Debugging log for hospitals list before map */}
                  {console.log("[Hospitals Render] hospitals:", hospitals)}
                  {Array.isArray(hospitals) && hospitals.map((hospital) => (
                    <ListItem key={hospital.id} sx={styles.listItem}>
                      <ListItemText primary={hospital.name || 'N/A'} secondary={`${hospital.city || 'N/A'} | ${hospital.address || 'N/A'}`} />
                      <Stack direction="row" spacing={1}>
                        <Button variant="contained" color="primary" onClick={() => handleEditHospital(hospital)}>
                          <Edit />
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleDeleteHospital(hospital.id)}>
                          <Delete />
                        </Button>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {activeTab === 4 && (
              <Box component="form" onSubmit={handleHospitalSubmit}>
                <TextField
                  label="Hospital Name"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="City"
                  value={hospitalCity}
                  onChange={(e) => setHospitalCity(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Address"
                  value={hospitalAddress}
                  onChange={(e) => setHospitalAddress(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" color="primary">
                  Add Hospital
                </Button>
              </Box>
            )}
            {activeTab === 5 && (
              <Box>
                <Typography variant="h6">Specializations</Typography>
                <List>
                  {/* Debugging log for specializations list before map */}
                  {console.log("[Specializations Render] specializations:", specializations)}
                  {Array.isArray(specializations) && specializations.map((specialization) => (
                    <ListItem key={specialization.id} sx={styles.listItem}>
                      <ListItemText primary={specialization.name || 'N/A'} />
                      <Stack direction="row" spacing={1}>
                        <Button variant="contained" color="primary" onClick={() => handleEditSpecialization(specialization)}>
                          <Edit />
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleDeleteSpecialization(specialization.id)}>
                          <Delete />
                        </Button>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {activeTab === 6 && (
              <Box component="form" onSubmit={handleSpecializationSubmit}>
                <TextField
                  label="Specialization Name"
                  value={specializationName}
                  onChange={(e) => setSpecializationName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" color="primary">
                  Add Specialization
                </Button>
              </Box>
            )}
            
            
{activeTab === 7 && (
  <Box component="form" onSubmit={handleAddAmbulance}>
    <TextField
      label="Contact Number"
      value={ambulanceContactNumber}
      onChange={(e) => setAmbulanceContactNumber(e.target.value)}
      fullWidth
      margin="normal"
      required
    />

    <TextField
      label="Driver Name"
      value={ambulanceDriverName}
      onChange={(e) => setAmbulanceDriverName(e.target.value)}
      fullWidth
      margin="normal"
      required
    />

    <TextField
      label="Vehicle Number" // ✅ Match backend field
      value={ambulanceRegistrationNumber}
      onChange={(e) => setAmbulanceRegistrationNumber(e.target.value)}
      fullWidth
      margin="normal"
      required
    />

    <TextField
      select
      label="Ambulance Type"
      value={ambulanceType}
      onChange={(e) => setAmbulanceType(e.target.value)}
      fullWidth
      margin="normal"
      required
    >
      <MenuItem value="BASIC">Basic</MenuItem>
      <MenuItem value="ADVANCED">Advanced</MenuItem>
      <MenuItem value="ICU">ICU</MenuItem>
      <MenuItem value="NEONATAL">Neonatal</MenuItem>
    </TextField>

    <TextField
      select
      label="Status"
      value={ambulanceStatus}
      onChange={(e) => setAmbulanceStatus(e.target.value)}
      fullWidth
      margin="normal"
      required
    >
      <MenuItem value="AVAILABLE">Available</MenuItem>
      <MenuItem value="BOOKED">Booked</MenuItem>
    </TextField>

    <Button type="submit" variant="contained" color="primary">
      Add Ambulance
    </Button>
  </Box>
)}


          </Box>
        </Box>
      </Paper>

      {/* Dialog for editing hospitals */}
      <Dialog open={openHospitalDialog} onClose={() => setOpenHospitalDialog(false)}>
        <DialogTitle>Edit Hospital</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Hospital Name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="City"
            value={hospitalCity}
            onChange={(e) => setHospitalCity(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Address"
            value={hospitalAddress}
            onChange={(e) => setHospitalAddress(e.target.value)}
            fullWidth
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="contained" color="primary" onClick={handleSubmitHospital}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setOpenHospitalDialog(false)}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing specializations */}
      <Dialog open={openSpecializationDialog} onClose={() => setOpenSpecializationDialog(false)}>
        <DialogTitle>Edit Specialization</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Specialization Name"
            value={specializationName}
            onChange={(e) => setSpecializationName(e.target.value)}
            fullWidth
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="contained" color="primary" onClick={handleSubmitSpecialization}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setOpenSpecializationDialog(false)}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="firstName"
            fullWidth
            value={selectedUser?.firstName || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastName"
            fullWidth
            value={selectedUser?.lastName || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={selectedUser?.email || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            fullWidth
            value={selectedUser?.role || ""}
            onChange={handleChange}
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </Container>
  );
}

const styles = {
  listItem: {
    mb: 2,
    p: 2,
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
};
