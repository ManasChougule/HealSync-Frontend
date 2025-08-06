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
import { Delete, Edit, CheckCircle, Cancel, AccessTime, Help, Logout, ArrowBack } from "@mui/icons-material";
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
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [specializationName, setSpecializationName] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [openHospitalDialog, setOpenHospitalDialog] = useState(false);
  const [openSpecializationDialog, setOpenSpecializationDialog] = useState(false);

  // New states for Ambulance management
  const [ambulances, setAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [openAmbulanceDialog, setOpenAmbulanceDialog] = useState(false);
  const [ambulanceNumber, setAmbulanceNumber] = useState("");
  const [ambulanceLocation, setAmbulanceLocation] = useState("");

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

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page in the history stack
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
    if (!hospitalName || !hospitalCity || !hospitalAddress) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:8080/hospitals/add", { name: hospitalName, city: hospitalCity, address: hospitalAddress })
      .then(() => {
        toast.success("Hospital added successfully!");
        setHospitalName("");
        setHospitalCity("");
        setHospitalAddress("");
        setLoading(false);
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
        axios.get("http://localhost:8080/specializations/all").then((response) => {
          setSpecialization(response.data);
        });
      })
      .catch(() => {
        toast.error("Error adding specialization");
        setLoading(false);
      });
  };

  const handleEditSpecialization = (specialization) => {
    setSelectedSpecialization(specialization);
    setSpecializationName(specialization.name);
    setOpenSpecializationDialog(true);
  };

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

  const handleEditHospital = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalName(hospital.name);
    setHospitalCity(hospital.city);
    setHospitalAddress(hospital.address);
    setOpenHospitalDialog(true);
  };

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

  const handleSubmitHospital = () => {
    if (!hospitalName || !hospitalCity || !hospitalAddress) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    axios
      .put(`http://localhost:8080/hospitals/update/${selectedHospital.id}`, { name: hospitalName, city: hospitalCity, address: hospitalAddress })
      .then(() => {
        toast.success("Hospital updated successfully!");
        setLoading(false);
        axios.get("http://localhost:8080/hospitals/all").then((response) => {
          setHospitals(response.data);
        });
        setOpenHospitalDialog(false);
      })
      .catch(() => {
        toast.error("Error updating hospital");
        setLoading(false);
      });
  };

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
        axios.get("http://localhost:8080/specializations/all").then((response) => {
          setSpecialization(response.data);
        });
        setOpenSpecializationDialog(false);
      })
      .catch(() => {
        toast.error("Error updating specialization");
        setLoading(false);
      });
  };

  // Ambulance Handlers
  const handleAddAmbulance = () => {
    if (!ambulanceNumber || !ambulanceLocation) {
      toast.error("Please fill all ambulance fields");
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:8080/ambulances/add", { number: ambulanceNumber, location: ambulanceLocation })
      .then(() => {
        toast.success("Ambulance added successfully!");
        setAmbulanceNumber("");
        setAmbulanceLocation("");
        setLoading(false);
        axios.get("http://localhost:8080/ambulances/all").then((response) => {
          setAmbulances(response.data);
        });
      })
      .catch(() => {
        toast.error("Error adding ambulance");
        setLoading(false);
      });
  };

  const handleEditAmbulance = (ambulance) => {
    setSelectedAmbulance(ambulance);
    setAmbulanceNumber(ambulance.number);
    setAmbulanceLocation(ambulance.location);
    setOpenAmbulanceDialog(true);
  };

  const handleDeleteAmbulance = (ambulanceId) => {
    if (window.confirm("Are you sure you want to delete this ambulance?")) {
      setLoading(true);
      axios
        .delete(`http://localhost:8080/ambulances/delete/${ambulanceId}`)
        .then(() => {
          toast.success("Ambulance deleted successfully!");
          setAmbulances(ambulances.filter((a) => a.id !== ambulanceId));
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error deleting ambulance");
          setLoading(false);
        });
    }
  };

  const handleSubmitAmbulance = () => {
    if (!ambulanceNumber || !ambulanceLocation) {
      toast.error("Please fill all ambulance fields");
      return;
    }
    setLoading(true);
    axios
      .put(`http://localhost:8080/ambulances/update/${selectedAmbulance.id}`, { number: ambulanceNumber, location: ambulanceLocation })
      .then(() => {
        toast.success("Ambulance updated successfully!");
        setLoading(false);
        axios.get("http://localhost:8080/ambulances/all").then((response) => {
          setAmbulances(response.data);
        });
        setOpenAmbulanceDialog(false);
      })
      .catch(() => {
        toast.error("Error updating ambulance");
        setLoading(false);
      });
  };

  const renderAmbulances = () => (
    <List>
      {ambulances.map((ambulance) => (
        <ListItem key={ambulance.id} sx={styles.listItem}>
          <ListItemText primary={`Number: ${ambulance.number}`} secondary={`Location: ${ambulance.location}`} />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="primary" onClick={() => handleEditAmbulance(ambulance)}>
              <Edit />
            </Button>
            <Button variant="contained" color="error" onClick={() => handleDeleteAmbulance(ambulance.id)}>
              <Delete />
            </Button>
          </Stack>
        </ListItem>
      ))}
    </List>
  );

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
            {/* Removed <Tab label="Ambulances" /> */}
            <Tab label="Add Ambulance" /> {/* This tab is now at index 7 */}
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
                    <ListItemText primary={hospital.name} secondary={`${hospital.city} | ${hospital.address}`} />
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
                {/* Display ambulances list below hospitals when on Hospitals tab */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Ambulances</Typography>
                {renderAmbulances()}
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
            {/* activeTab === 7 now corresponds to "Add Ambulance" */}
            {activeTab === 7 && (
              <Box component="form" onSubmit={handleAddAmbulance}>
                <TextField
                  label="Ambulance Number"
                  value={ambulanceNumber}
                  onChange={(e) => setAmbulanceNumber(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Ambulance Location"
                  value={ambulanceLocation}
                  onChange={(e) => setAmbulanceLocation(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
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

      {/* Dialog for editing ambulances */}
      <Dialog open={openAmbulanceDialog} onClose={() => setOpenAmbulanceDialog(false)}>
        <DialogTitle>Edit Ambulance</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Ambulance Number"
            value={ambulanceNumber}
            onChange={(e) => setAmbulanceNumber(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Ambulance Location"
            value={ambulanceLocation}
            onChange={(e) => setAmbulanceLocation(e.target.value)}
            fullWidth
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="contained" color="primary" onClick={handleSubmitAmbulance}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setOpenAmbulanceDialog(false)}>
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
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={selectedUser ?.email || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            fullWidth
            value={selectedUser ?.role || ""}
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
