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
} from "@mui/material";
import { Delete, Edit, CheckCircle, Cancel, AccessTime, Help, Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminHome() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecialization] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalCity, setHospitalCity] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState(""); // New state for hospital address
  const [specializationName, setSpecializationName] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [openHospitalDialog, setOpenHospitalDialog] = useState(false);
  const [openSpecializationDialog, setOpenSpecializationDialog] = useState(false);

  // Load users
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/registration/all?role=ADMIN")
      .then((response) => {
        const allUsers = response.data;
        setDoctors(allUsers.filter((user) => user.role === "DOCTOR"));
        setPatients(allUsers.filter((user) => user.role === "PATIENT"));
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error fetching users");
        setLoading(false);
      });
  }, []);

  // Load appointments
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/registration/appointments?role=ADMIN")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error fetching appointments");
        setLoading(false);
      });
  }, []);

  // Load hospitals
  useEffect(() => {
    axios
      .get("http://localhost:8080/hospitals/all")
      .then((response) => {
        setHospitals(response.data);
      })
      .catch(() => {
        toast.error("Error fetching hospitals");
      });
  }, []);

  // Load specializations
  useEffect(() => {
    axios
      .get("http://localhost:8080/specializations/all")
      .then((response) => {
        setSpecialization(response.data);
      })
      .catch(() => {
        toast.error("Error fetching specializations");
      });
  }, []);

  const handleEdit = (user) => {
    setSelectedUser (user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser (null);
  };

  const handleSubmit = () => {
    setLoading(true);
    axios
      .put(`http://localhost:8080/registration/update/${selectedUser .id}`, selectedUser )
      .then(() => {
        toast.success("User  updated successfully!");
        setUsers(users.map((user) => (user.id === selectedUser .id ? selectedUser  : user)));
        setLoading(false);
        handleClose();
      })
      .catch(() => {
        toast.error("Error updating user");
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser ({ ...selectedUser , [name]: value });
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      axios
        .delete(`http://localhost:8080/registration/delete/${userId}`)
        .then(() => {
          toast.success("User  deleted successfully!");
          setUsers(users.filter((user) => user.id !== userId));
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error deleting user");
          setLoading(false);
        });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/");
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

  const renderUsers = (userList) => (
    <List>
      {userList.map((user) => (
        <ListItem key={user.id} sx={styles.listItem}>
          <ListItemAvatar>
            <Avatar src={user.gender === "MALE" ? "/male.png" : "/female.png"} />
          </ListItemAvatar>
          <ListItemText
            primary={`${user.firstName} ${user.lastName}`}
            secondary={`${user.role} | ${user.email}`}
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

  const renderAppointments = () => (
    <List>
      {appointments.map((appointment) => (
        <ListItem key={appointment.id} sx={styles.listItem}>
          <ListItemText
            primary={`Date: ${appointment.day} at ${appointment.time}`}
            secondary={`Doctor: ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName} | Patient: ${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
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

  const handleHospitalSubmit = () => {
    if (!hospitalName || !hospitalCity || !hospitalAddress) { // Check for address
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:8080/hospitals/add", { name: hospitalName, city: hospitalCity, address: hospitalAddress }) // Include address
      .then(() => {
        toast.success("Hospital added successfully!");
        setHospitalName("");
        setHospitalCity("");
        setHospitalAddress(""); // Reset address
        setLoading(false);
        // Reload hospitals
        axios.get("http://localhost:8080/hospitals/all").then((response) => {
          setHospitals(response.data);
        });
      })
      .catch(() => {
        toast.error("Error adding hospital");
        setLoading(false);
      });
  };

  const handleSpecializationSubmit = () => {
    if (!specializationName) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:8080/specializations/add", { name: specializationName })
      .then(() => {
        toast.success("Specialization added successfully!");
        setSpecializationName("");
        setLoading(false);
        // Reload specializations
        axios.get("http://localhost:8080/specializations/all").then((response) => {
          setSpecialization(response.data);
        });
      })
      .catch(() => {
        toast.error("Error adding specialization");
        setLoading(false);
      });
  };

  // Define the handleEditSpecialization function
  const handleEditSpecialization = (specialization) => {
    setSelectedSpecialization(specialization);
    setSpecializationName(specialization.name);
    setOpenSpecializationDialog(true); // Open the specialization edit dialog
  };

  // Define the handleDeleteSpecialization function
  const handleDeleteSpecialization = (specializationId) => {
    if (window.confirm("Are you sure you want to delete this specialization?")) {
      setLoading(true);
      axios
        .delete(`http://localhost:8080/specializations/delete/${specializationId}`)
        .then(() => {
          toast.success("Specialization deleted successfully!");
          setSpecialization(specializations.filter((s) => s.id !== specializationId));
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error deleting specialization");
          setLoading(false);
        });
    }
  };

  // Define the handleEditHospital function
  const handleEditHospital = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalName(hospital.name);
    setHospitalCity(hospital.city);
    setHospitalAddress(hospital.address); // Set address for editing
    setOpenHospitalDialog(true); // Open the hospital edit dialog
  };

  // Define the handleDeleteHospital function
  const handleDeleteHospital = (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      setLoading(true);
      axios
        .delete(`http://localhost:8080/hospitals/delete/${hospitalId}`)
        .then(() => {
          toast.success("Hospital deleted successfully!");
          setHospitals(hospitals.filter((hospital) => hospital.id !== hospitalId));
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error deleting hospital");
          setLoading(false);
        });
    }
  };

  // Handle submission for editing a hospital
  const handleSubmitHospital = () => {
    if (!hospitalName || !hospitalCity || !hospitalAddress) { // Check for address
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    axios
      .put(`http://localhost:8080/hospitals/update/${selectedHospital.id}`, { name: hospitalName, city: hospitalCity, address: hospitalAddress }) // Include address
      .then(() => {
        toast.success("Hospital updated successfully!");
        setLoading(false);
        // Reload hospitals
        axios.get("http://localhost:8080/hospitals/all").then((response) => {
          setHospitals(response.data);
        });
        setOpenHospitalDialog(false); // Close the dialog
      })
      .catch(() => {
        toast.error("Error updating hospital");
        setLoading(false);
      });
  };

  // Handle submission for editing a specialization
  const handleSubmitSpecialization = () => {
    if (!specializationName) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    axios
      .put(`http://localhost:8080/specializations/update/${selectedSpecialization.id}`, { name: specializationName })
      .then(() => {
        toast.success("Specialization updated successfully!");
        setLoading(false);
        // Reload specializations
        axios.get("http://localhost:8080/specializations/all").then((response) => {
          setSpecialization(response.data);
        });
        setOpenSpecializationDialog(false); // Close the dialog
      })
      .catch(() => {
        toast.error("Error updating specialization");
        setLoading(false);
      });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Admin Dashboard</Typography>
          <Button variant="outlined" color="error" onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)}>
            <Tab label="Doctors" />
            <Tab label="Patients" />
            <Tab label="Appointments" />
            <Tab label="Hospitals" />
            <Tab label="Add Hospital" />
            <Tab label="specializations" />
            <Tab label="Add specialization" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {loading && <CircularProgress />}
            {activeTab === 0 && renderUsers(doctors)}
            {activeTab === 1 && renderUsers(patients)}
            {activeTab === 2 && renderAppointments()}
            {activeTab === 3 && (
              <List>
                {hospitals.map((hospital) => (
                  <ListItem key={hospital.id} sx={styles.listItem}>
                    <ListItemText primary={hospital.name} secondary={`${hospital.city} | ${hospital.address}`} /> {/* Display address */}
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
            )}
            {activeTab === 4 && (
              <Box component="form" onSubmit={handleHospitalSubmit}>
                <TextField
                  label="Hospital Name"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required // Ensure the field is required
                />
                <TextField
                  label="City"
                  value={hospitalCity}
                  onChange={(e) => setHospitalCity(e.target.value)}
                  fullWidth
                  margin="normal"
                  required // Ensure the field is required
                />
                <TextField
                  label="Address" // New address field
                  value={hospitalAddress}
                  onChange={(e) => setHospitalAddress(e.target.value)}
                  fullWidth
                  margin="normal"
                  required // Ensure the field is required
                />
                <Button type="submit" variant="contained" color="primary">
                  Add Hospital
                </Button>
              </Box>
            )}
            {activeTab === 5 && (
              <Box>
                <Typography variant="h6">specializations</Typography>
                <List>
                  {specializations.map((specialization) => (
                    <ListItem key={specialization.id} sx={styles.listItem}>
                      <ListItemText primary={specialization.name} />
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
                  label="specialization Name"
                  value={specializationName}
                  onChange={(e) => setSpecializationName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required // Ensure the field is required
                />
                <Button type="submit" variant="contained" color="primary">
                  Add specialization
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
            label="Address" // New address field for editing
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
            value={selectedUser ?.firstName || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastName"
            fullWidth
            value={selectedUser ?.lastName || ""}
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
      <Box sx={{ mt: 2 }}>
        <Button
  component={Link}
  to="/admin/add-ambulance"
  variant="contained"
  sx={{ backgroundColor: 'red', color: 'white' }} // Custom red color
>
  Add Ambulance
</Button>

      </Box>
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
