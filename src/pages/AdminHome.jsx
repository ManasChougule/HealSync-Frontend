import React, { useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import { Delete, Edit, CheckCircle, Cancel, AccessTime, Help, Logout, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminHome() {
  const navigate = useNavigate();

  // State variables
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
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [specializationName, setSpecializationName] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [openHospitalDialog, setOpenHospitalDialog] = useState(false);
  const [openSpecializationDialog, setOpenSpecializationDialog] = useState(false);

  // States for Ambulance management (only add ambulance related states remain)
  // const [ambulances, setAmbulances] = useState([]); // Removed: No longer fetching/displaying list
  const [ambulanceContactNumber, setAmbulanceContactNumber] = useState("");
  const [ambulanceDriverName, setAmbulanceDriverName] = useState("");
  const [ambulanceRegistrationNumber, setAmbulanceRegistrationNumber] = useState("");
  const [ambulanceStatus, setAmbulanceStatus] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");

  // State for Doctor Appointment Stats
  const [doctorStats, setDoctorStats] = useState([]);

  // Validation states for forms
  const [hospitalNameError, setHospitalNameError] = useState("");
  const [hospitalCityError, setHospitalCityError] = useState("");
  const [hospitalAddressError, setHospitalAddressError] = useState("");
  const [specializationNameError, setSpecializationNameError] = useState("");
  const [ambulanceContactNumberError, setAmbulanceContactNumberError] = useState("");
  const [ambulanceDriverNameError, setAmbulanceDriverNameError] = useState("");
  const [ambulanceRegistrationNumberError, setAmbulanceRegistrationNumberError] = useState("");
  const [ambulanceStatusError, setAmbulanceStatusError] = useState("");
  const [ambulanceTypeError, setAmbulanceTypeError] = useState("");
  const [userFirstNameError, setUserFirstNameError] = useState("");
  const [userLastNameError, setUserLastNameError] = useState("");
  const [userEmailError, setUserEmailError] = useState("");
  const [userRoleError, setUserRoleError] = useState("");


  // Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^[6-9]\d{9}$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const vehicleNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

  // Helper function to safely get array data from API response
  const getArrayFromResponse = (data) => {
    if (data === null || data === undefined || !Array.isArray(data)) {
      return [];
    }
    return data;
  };

  // Fetch Users (Doctors and Patients)
  useEffect(() => {
    // TODO: Add JWT authentication check here
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/registration/all?role=ADMIN");
        const allUsers = getArrayFromResponse(response.data);

        setDoctors(allUsers.filter((user) => user.role === "DOCTOR"));
        setPatients(allUsers.filter((user) => user.role === "PATIENT"));
        setUsers(allUsers);
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Appointments
  useEffect(() => {
    // TODO: Add JWT authentication check here
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/registration/appointments?role=ADMIN");
        setAppointments(getArrayFromResponse(response.data));
      } catch (error) {
        toast.error("Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Fetch Hospitals
  useEffect(() => {
    // TODO: Add JWT authentication check here
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:8080/hospitals/all");
        setHospitals(getArrayFromResponse(response.data));
      } catch (error) {
        toast.error("Error fetching hospitals");
      }
    };
    fetchHospitals();
  }, []);

  // Fetch Specializations
  useEffect(() => {
    // TODO: Add JWT authentication check here
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/specializations/all");
        setSpecialization(getArrayFromResponse(response.data));
      } catch (error) {
        toast.error("Error fetching specializations");
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch Doctor Appointment Statistics
  useEffect(() => {
    // TODO: Add JWT authentication check here
    const fetchDoctorStats = async () => {
      try {
        const response = await axios.get("http://localhost:8080/appointments/doctors-availability-summary");
        setDoctorStats(getArrayFromResponse(response.data));
      } catch (error) {
        toast.error("Error fetching doctor statistics");
      }
    };
    fetchDoctorStats();
  }, []);

  // Removed: Fetch Ambulances useEffect
  // useEffect(() => {
  //   const fetchAmbulances = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get("http://localhost:8080/api/ambulances/all");
  //       setAmbulances(getArrayFromResponse(response.data));
  //     } catch (error) {
  //       toast.error("Error fetching ambulances");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchAmbulances();
  // }, []);

  // User Management Handlers
  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
    // Clear previous errors when opening dialog
    setUserFirstNameError("");
    setUserLastNameError("");
    setUserEmailError("");
    setUserRoleError("");
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    // Clear errors on close
    setUserFirstNameError("");
    setUserLastNameError("");
    setUserEmailError("");
    setUserRoleError("");
  };

  const validateUserFields = () => {
    let isValid = true;
    if (!selectedUser?.firstName || !nameRegex.test(selectedUser.firstName)) {
      setUserFirstNameError("First name should contain only letters.");
      isValid = false;
    } else {
      setUserFirstNameError("");
    }
    if (!selectedUser?.lastName || !nameRegex.test(selectedUser.lastName)) {
      setUserLastNameError("Last name should contain only letters.");
      isValid = false;
    } else {
      setUserLastNameError("");
    }
    if (!selectedUser?.email || !emailRegex.test(selectedUser.email)) {
      setUserEmailError("Enter a valid email address.");
      isValid = false;
    } else {
      setUserEmailError("");
    }
    if (!selectedUser?.role) {
      setUserRoleError("Role cannot be empty.");
      isValid = false;
    } else {
      setUserRoleError("");
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateUserFields()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Add JWT token to headers
      await axios.put(`http://localhost:8080/registration/update/${selectedUser.id}`, selectedUser);
      toast.success("User updated successfully!");
      if (selectedUser.role === "DOCTOR") {
        setDoctors(doctors.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
      } else if (selectedUser.role === "PATIENT") {
        setPatients(patients.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
      }
      handleClose();
    } catch (error) {
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
    // Clear error for the specific field on change
    if (name === "firstName") setUserFirstNameError("");
    if (name === "lastName") setUserLastNameError("");
    if (name === "email") setUserEmailError("");
    if (name === "role") setUserRoleError("");
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        // TODO: Add JWT token to headers
        await axios.delete(`http://localhost:8080/registration/delete/${userId}`);
        toast.success("User deleted successfully!");
        setDoctors(doctors.filter((user) => user.id !== userId));
        setPatients(patients.filter((user) => user.id !== userId));
      } catch (error) {
        toast.error("Error deleting user");
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
    return (
      <List>
        {Array.isArray(userList) && userList.map((user) => (
          <ListItem key={user.id} sx={styles.listItem}>
            <ListItemAvatar>
              <Avatar src={user.gender === "MALE" ? "/male.png" : "/female.png"} />
            </ListItemAvatar>
            <ListItemText
              primary={`${user.firstName || ''} ${user.lastName || ''}`}
              secondary={`${user.role || ''} | ${user.email || ''}`}
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

  // Hospital Management Handlers
  const validateHospitalFields = () => {
    let isValid = true;
    if (!hospitalName || !nameRegex.test(hospitalName)) {
      setHospitalNameError("Hospital name should contain only letters.");
      isValid = false;
    } else {
      setHospitalNameError("");
    }
    if (!hospitalCity || !nameRegex.test(hospitalCity)) {
      setHospitalCityError("City should contain only letters.");
      isValid = false;
    } else {
      setHospitalCityError("");
    }
    if (!hospitalAddress) {
      setHospitalAddressError("Address cannot be empty.");
      isValid = false;
    } else {
      setHospitalAddressError("");
    }
    return isValid;
  };

  const handleHospitalSubmit = async (event) => {
    event.preventDefault();
    if (!validateHospitalFields()) {
      return;
    }
    setLoading(true);
    try {
      // TODO: Add JWT token to headers
      const response = await axios.post("http://localhost:8080/hospitals/add", { name: hospitalName, city: hospitalCity, address: hospitalAddress });
      toast.success("Hospital added successfully!");
      if (response.data) {
        setHospitals([...hospitals, response.data]);
      }
      setHospitalName("");
      setHospitalCity("");
      setHospitalAddress("");
      setHospitalNameError("");
      setHospitalCityError("");
      setHospitalAddressError("");
    } catch (error) {
      toast.error("Error adding hospital");
    } finally {
      setLoading(false);
    }
  };

  const handleEditHospital = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalName(hospital.name);
    setHospitalCity(hospital.city);
    setHospitalAddress(hospital.address);
    setOpenHospitalDialog(true);
    // Clear previous errors when opening dialog
    setHospitalNameError("");
    setHospitalCityError("");
    setHospitalAddressError("");
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      setLoading(true);
      try {
        // TODO: Add JWT token to headers
        await axios.delete(`http://localhost:8080/hospitals/delete/${hospitalId}`);
        toast.success("Hospital deleted successfully!");
        setHospitals(hospitals.filter((hospital) => hospital.id !== hospitalId));
      } catch (error) {
        toast.error("Error deleting hospital");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitHospital = async () => {
    if (!validateHospitalFields()) {
      return;
    }
    setLoading(true);
    try {
      const updatedHospital = { name: hospitalName, city: hospitalCity, address: hospitalAddress };
      // TODO: Add JWT token to headers
      await axios.put(`http://localhost:8080/hospitals/update/${selectedHospital.id}`, updatedHospital);
      toast.success("Hospital updated successfully!");
      setHospitals(hospitals.map((h) => (h.id === selectedHospital.id ? { ...h, ...updatedHospital } : h)));
      setOpenHospitalDialog(false);
      setHospitalNameError("");
      setHospitalCityError("");
      setHospitalAddressError("");
    } catch (error) {
      toast.error("Error updating hospital");
    } finally {
      setLoading(false);
    }
  };

  // Specialization Management Handlers
  const validateSpecializationFields = () => {
    let isValid = true;
    if (!specializationName || !nameRegex.test(specializationName)) {
      setSpecializationNameError("Specialization name should contain only letters.");
      isValid = false;
    } else {
      setSpecializationNameError("");
    }
    return isValid;
  };

  const handleSpecializationSubmit = async (event) => {
    event.preventDefault();
    if (!validateSpecializationFields()) {
      return;
    }
    setLoading(true);
    try {
      // TODO: Add JWT token to headers
      const response = await axios.post("http://localhost:8080/specializations/add", { name: specializationName });
      toast.success("Specialization added successfully!");
      if (response.data) {
        setSpecialization([...specializations, response.data]);
      }
      setSpecializationName("");
      setSpecializationNameError("");
    } catch (error) {
      toast.error("Error adding specialization");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSpecialization = (specialization) => {
    setSelectedSpecialization(specialization);
    setSpecializationName(specialization.name);
    setOpenSpecializationDialog(true);
    // Clear previous errors when opening dialog
    setSpecializationNameError("");
  };

  const handleDeleteSpecialization = async (specializationId) => {
    if (window.confirm("Are you sure you want to delete this specialization?")) {
      setLoading(true);
      try {
        // TODO: Add JWT token to headers
        await axios.delete(`http://localhost:8080/specializations/delete/${specializationId}`);
        toast.success("Specialization deleted successfully!");
        setSpecialization(specializations.filter((s) => s.id !== specializationId));
      } catch (error) {
        toast.error("Error deleting specialization");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitSpecialization = async () => {
    if (!validateSpecializationFields()) {
      return;
    }
    setLoading(true);
    try {
      const updatedSpecialization = { name: specializationName };
      // TODO: Add JWT token to headers
      await axios.put(`http://localhost:8080/specializations/update/${selectedSpecialization.id}`, updatedSpecialization);
      toast.success("Specialization updated successfully!");
      setSpecialization(specializations.map((s) => (s.id === selectedSpecialization.id ? { ...s, ...updatedSpecialization } : s)));
      setOpenSpecializationDialog(false);
      setSpecializationNameError("");
    } catch (error) {
      toast.error("Error updating specialization");
    } finally {
      setLoading(false);
    }
  };

  // Ambulance Management Handlers (only Add Ambulance remains)
  const validateAmbulanceFields = () => {
    let isValid = true;
    if (!ambulanceContactNumber || !phoneNumberRegex.test(ambulanceContactNumber)) {
      setAmbulanceContactNumberError("Mobile number must start with 6-9 and be 10 digits.");
      isValid = false;
    } else {
      setAmbulanceContactNumberError("");
    }
    if (!ambulanceDriverName || !nameRegex.test(ambulanceDriverName)) {
      setAmbulanceDriverNameError("Driver name should contain only letters.");
      isValid = false;
    } else {
      setAmbulanceDriverNameError("");
    }
    if (!ambulanceRegistrationNumber || !vehicleNumberRegex.test(ambulanceRegistrationNumber)) {
      setAmbulanceRegistrationNumberError("Enter a valid vehicle number (e.g., MH12AB1234).");
      isValid = false;
    } else {
      setAmbulanceRegistrationNumberError("");
    }
    if (!ambulanceStatus) {
      setAmbulanceStatusError("Status cannot be empty.");
      isValid = false;
    } else {
      setAmbulanceStatusError("");
    }
    if (!ambulanceType) {
      setAmbulanceTypeError("Ambulance type cannot be empty.");
      isValid = false;
    } else {
      setAmbulanceTypeError("");
    }
    return isValid;
  };

  const handleAddAmbulance = async (event) => {
    event.preventDefault();

    if (!validateAmbulanceFields()) {
      return;
    }

    setLoading(true);

    const ambulanceData = {
      contactNumber: ambulanceContactNumber,
      driverName: ambulanceDriverName,
      vehicleNumber: ambulanceRegistrationNumber,
      available: ambulanceStatus === "AVAILABLE",
      type: ambulanceType,
    };

    try {
      // TODO: Add JWT token to headers
      const response = await axios.post("http://localhost:8080/api/ambulances/add", ambulanceData);
      toast.success("Ambulance added successfully!");
      // Removed: setAmbulances([...ambulances, response.data]); // No longer maintaining a list in AdminHome
      setAmbulanceContactNumber("");
      setAmbulanceDriverName("");
      setAmbulanceRegistrationNumber("");
      setAmbulanceStatus("");
      setAmbulanceType("");
      // Clear all ambulance form errors on success
      setAmbulanceContactNumberError("");
      setAmbulanceDriverNameError("");
      setAmbulanceRegistrationNumberError("");
      setAmbulanceStatusError("");
      setAmbulanceTypeError("");
    } catch (error) {
      toast.error("Error adding ambulance. Please check the server logs for details.");
    } finally {
      setLoading(false);
    }
  };

  // Removed: handleDeleteAmbulance function
  // const handleDeleteAmbulance = async (ambulanceId) => {
  //   if (window.confirm("Are you sure you want to delete this ambulance?")) {
  //     setLoading(true);
  //     try {
  //       await axios.delete(`http://localhost:8080/api/ambulances/delete/${ambulanceId}`);
  //       toast.success("Ambulance deleted successfully!");
  //       setAmbulances(ambulances.filter((ambulance) => ambulance.id !== ambulanceId));
  //     } catch (error) {
  //       toast.error("Error deleting ambulance");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // Removed: renderAmbulances function
  // const renderAmbulances = () => {
  //   return (
  //     <List>
  //       {Array.isArray(ambulances) && ambulances.map((ambulance) => (
  //         <ListItem key={ambulance.id} sx={styles.listItem}>
  //           <ListItemText
  //             primary={`Driver: ${ambulance.driverName || 'N/A'} | Vehicle: ${ambulance.vehicleNumber || 'N/A'}`}
  //             secondary={`Contact: ${ambulance.contactNumber || 'N/A'} | Type: ${ambulance.type || 'N/A'} | Status: ${ambulance.available ? 'Available' : 'Booked'}`}
  //           />
  //           <Stack direction="row" spacing={1}>
  //             <Button variant="contained" color="error" onClick={() => handleDeleteAmbulance(ambulance.id)}>
  //               <Delete />
  //             </Button>
  //           </Stack>
  //         </ListItem>
  //       ))}
  //     </List>
  //   );
  // };


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
          <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} variant="scrollable" scrollButtons="auto">
            <Tab label="Doctors" />
            <Tab label="Patients" />
            <Tab label="Appointments" />
            <Tab label="Hospitals" />
            <Tab label="Add Hospital" />
            <Tab label="Specializations" />
            <Tab label="Add Specialization" />
            {/* Removed: <Tab label="Ambulances" /> */}
            <Tab label="Add Ambulance" />
            <Tab label="Doctor Statistics" />
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
                  onChange={(e) => { setHospitalName(e.target.value); setHospitalNameError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!hospitalNameError}
                  helperText={hospitalNameError}
                />
                <TextField
                  label="City"
                  value={hospitalCity}
                  onChange={(e) => { setHospitalCity(e.target.value); setHospitalCityError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!hospitalCityError}
                  helperText={hospitalCityError}
                />
                <TextField
                  label="Address"
                  value={hospitalAddress}
                  onChange={(e) => { setHospitalAddress(e.target.value); setHospitalAddressError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!hospitalAddressError}
                  helperText={hospitalAddressError}
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
                  onChange={(e) => { setSpecializationName(e.target.value); setSpecializationNameError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!specializationNameError}
                  helperText={specializationNameError}
                />
                <Button type="submit" variant="contained" color="primary">
                  Add Specialization
                </Button>
              </Box>
            )}
            {/* Removed: activeTab === 7 && renderAmbulances() */}
            {activeTab === 7 && ( // This tab index might need adjustment based on the final order
              <Box component="form" onSubmit={handleAddAmbulance}>
                <TextField
                  label="Contact Number"
                  value={ambulanceContactNumber}
                  onChange={(e) => { setAmbulanceContactNumber(e.target.value); setAmbulanceContactNumberError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!ambulanceContactNumberError}
                  helperText={ambulanceContactNumberError}
                />
                <TextField
                  label="Driver Name"
                  value={ambulanceDriverName}
                  onChange={(e) => { setAmbulanceDriverName(e.target.value); setAmbulanceDriverNameError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!ambulanceDriverNameError}
                  helperText={ambulanceDriverNameError}
                />
                <TextField
                  label="Vehicle Number"
                  value={ambulanceRegistrationNumber}
                  onChange={(e) => { setAmbulanceRegistrationNumber(e.target.value); setAmbulanceRegistrationNumberError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!ambulanceRegistrationNumberError}
                  helperText={ambulanceRegistrationNumberError}
                />
                <TextField
                  select
                  label="Ambulance Type"
                  value={ambulanceType}
                  onChange={(e) => { setAmbulanceType(e.target.value); setAmbulanceTypeError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!ambulanceTypeError}
                  helperText={ambulanceTypeError}
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
                  onChange={(e) => { setAmbulanceStatus(e.target.value); setAmbulanceStatusError(""); }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!ambulanceStatusError}
                  helperText={ambulanceStatusError}
                >
                  <MenuItem value="AVAILABLE">Available</MenuItem>
                  <MenuItem value="BOOKED">Booked</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                  Add Ambulance
                </Button>
              </Box>
            )}
            {activeTab === 8 && ( // This tab index might need adjustment based on the final order
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Doctor Appointment Statistics Overview
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress />
                    <Typography variant="subtitle1" sx={{ ml: 2 }}>Loading statistics...</Typography>
                  </Box>
                ) : doctorStats.length > 0 ? (
                  <>
                    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                        Appointments Status Across All Doctors
                      </Typography>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={doctorStats.map(stat => ({
                            name: stat.doctorName,
                            Confirmed: stat.confirmed,
                            Pending: stat.pending,
                            Cancelled: stat.cancelled,
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
                          <YAxis allowDecimals={false} />
                          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px' }} />
                          <Bar dataKey="Confirmed" stackId="a" fill="#4CAF50" name="Confirmed" />
                          <Bar dataKey="Pending" stackId="a" fill="#FFC107" name="Pending" />
                          <Bar dataKey="Cancelled" stackId="a" fill="#F44336" name="Cancelled" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                      Detailed Appointment Breakdown per Doctor
                    </Typography>
                    <Grid container spacing={3}>
                      {doctorStats.map((stat) => (
                        <Grid item xs={12} sm={6} md={6} key={stat.doctorId}>
                          <Paper elevation={2} sx={{
                            p: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}>
                            <Typography variant="subtitle1" align="center" sx={{ mb: 1, fontWeight: 'medium' }}>
                              {stat.doctorName}
                            </Typography>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Confirmed', value: stat.confirmed },
                                    { name: 'Pending', value: stat.pending },
                                    { name: 'Cancelled', value: stat.cancelled },
                                  ].filter(entry => entry.value > 0)}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={70}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                  style={{ fontSize: '12px' }}
                                >
                                  <Cell key={`cell-confirmed-${stat.doctorId}`} fill="#4CAF50" />
                                  <Cell key={`cell-pending-${stat.doctorId}`} fill="#FFC107" />
                                  <Cell key={`cell-cancelled-${stat.doctorId}`} fill="#F44336" />
                                </Pie>
                                <Tooltip formatter={(value) => `${value} appointments`} />
                                <Legend
                                  layout="vertical"
                                  align="right"
                                  verticalAlign="middle"
                                  wrapperStyle={{ fontSize: '12px' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <Typography variant="body2" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
                              Total Appointments: <Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }}>{stat.totalAppointmentsReceived}</Typography>
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, flexDirection: 'column' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No doctor appointment statistics available.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please ensure doctors have appointments or check backend connectivity.
                    </Typography>
                  </Box>
                )}
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
            onChange={(e) => { setHospitalName(e.target.value); setHospitalNameError(""); }}
            fullWidth
            error={!!hospitalNameError}
            helperText={hospitalNameError}
          />
          <TextField
            margin="dense"
            label="City"
            value={hospitalCity}
            onChange={(e) => { setHospitalCity(e.target.value); setHospitalCityError(""); }}
            fullWidth
            error={!!hospitalCityError}
            helperText={hospitalCityError}
          />
          <TextField
            margin="dense"
            label="Address"
            value={hospitalAddress}
            onChange={(e) => { setHospitalAddress(e.target.value); setHospitalAddressError(""); }}
            fullWidth
            error={!!hospitalAddressError}
            helperText={hospitalAddressError}
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
            onChange={(e) => { setSpecializationName(e.target.value); setSpecializationNameError(""); }}
            fullWidth
            error={!!specializationNameError}
            helperText={specializationNameError}
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

      {/* Dialog for editing users */}
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
            error={!!userFirstNameError}
            helperText={userFirstNameError}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastName"
            fullWidth
            value={selectedUser?.lastName || ""}
            onChange={handleChange}
            error={!!userLastNameError}
            helperText={userLastNameError}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={selectedUser?.email || ""}
            onChange={handleChange}
            error={!!userEmailError}
            helperText={userEmailError}
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            fullWidth
            value={selectedUser?.role || ""}
            onChange={handleChange}
            error={!!userRoleError}
            helperText={userRoleError}
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
