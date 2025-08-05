import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Image,
  Container,
  Grid,
  Segment,
  Form,
  Modal,
  Loader,
  Tab,
  Label,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom"; 
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import medicalteam from "../assets/medical-team.png";
import examination from "../assets/examination.png";
import medicalappointment from "../assets/medical-appointment.png";
import hospital from "../assets/hospital.png";
import clinic from "../assets/clinic.png";

export default function AdminHome() {
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

  const [selectedHospital, setSelectedHospital] = useState(null);

  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

// State for adding a hospital
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalCity, setHospitalCity] = useState("");

  // State for adding expertise
  const [specializationName, setSpecializationName] = useState("");

  // Open the modal for editing the hospital
  const handleEditHospital = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalName(hospital.name);
    setHospitalCity(hospital.city);
  };

  // Open the modal for editing the specialization
  const handleEditSpecialization = (specialization) => {
    setSelectedSpecialization(specialization);
    setSpecializationName(specialization.name);
  };

  // Close the modal
  const handleCloseHospital = () => {
    setSelectedHospital(null);
    setHospitalName("");
    setHospitalCity("");
  };

  // Close the modal
  const handleCloseSpecialization = () => {
    setSelectedSpecialization(null);
    setSpecializationName("");
  };

  // Handle the form submission for editing the hospital
  const handleSubmitHospital = () => {
    if (!hospitalName || !hospitalCity) {
      toast.error("Please fill all fields", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    axios
      .put(`http://localhost:8080/hospitals/update/${selectedHospital.id}`, {
        name: hospitalName,
        city: hospitalCity,
      })
      .then((response) => {
        toast.success("Hospital updated successfully", {
          position: "bottom-center",
          autoClose: 3000,
        });
        // Reflect the update from the API response directly on the screen
        setHospitals((prevHospitals) =>
          prevHospitals.map((hospital) =>
            hospital.id === selectedHospital.id
              ? { ...hospital, name: hospitalName, city: hospitalCity }
              : hospital
          )
        );
        setLoading(false);
        handleCloseHospital();
      })
      .catch((error) => {
        toast.error("Error updating hospital", {
          position: "bottom-center",
          autoClose: 3000,
        });
        setLoading(false);
      });
  };

  const handleSubmitSpecialization = () => {
    if (!specializationName) {
      toast.error("Please fill all fields", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    axios
      .put(
        `http://localhost:8080/specializations/update/${selectedSpecialization.id}`,
        {
          name: specializationName,
        }
      )
      .then((response) => {
        toast.success("Clinic updated successfully", {
          position: "bottom-center",
          autoClose: 3000,
        });
       
        setSpecialization((prevSpecializations) =>
          prevSpecializations.map((specialization) =>
            specialization.id === selectedSpecialization.id
              ? { ...specialization, name: specializationName }
              : specialization
          )
        );

        setLoading(false);
        handleCloseSpecialization(); // Close the modal and reset old data
      })
      .catch((error) => {
        toast.error("Error updating clinic", {
          position: "bottom-center",
          autoClose: 3000,
        });
        setLoading(false);
      });
  };

  // Loading users
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/registration/all?role=ADMIN")
      .then((response) => {
        const allUsers = response.data;
        // Categorizing users based on their roles
        setDoctors(allUsers.filter((user) => user.role === "DOCTOR"));
        setPatients(allUsers.filter((user) => user.role === "PATIENT"));
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error fetching users", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
      });
  }, []);
 // Loading appointments
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/registration/appointments?role=ADMIN")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Error fetching appointments", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/hospitals/all")
      .then((response) => {
        setHospitals(response.data); 
      })
      .catch((error) => {
        toast.error("Error fetching hospitals", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/specializations/all")
      .then((response) => {
        setSpecialization(response.data); 
      })
      .catch((error) => {
        toast.error("Error fetching specializations", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      });
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      console.log("Selected Hospital: ", selectedHospital); // Check the currently selected hospital information
    }
  }, [selectedHospital]);

  useEffect(() => {
    if (selectedSpecialization) {
      console.log("Selected Specialization: ", selectedSpecialization); // Check the currently selected hospital information
    }
  }, [selectedSpecialization]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = () => {
    setLoading(true);
    axios
      .put(
        `http://localhost:8080/registration/update/${selectedUser.id}`,
        selectedUser
      )
      .then((response) => {
        toast.success("User updated successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? selectedUser : user
          )
        );
        setLoading(false);
        handleClose();
      })
      .catch((error) => {
        toast.error("An error occurred while updating the user.", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      axios
        .delete(`http://localhost:8080/registration/delete/${userId}`)
        .then((response) => {
          toast.success("User deleted successfully!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          setUsers(users.filter((user) => user.id !== userId));
          setLoading(false);
        })
        .catch((error) => {
          toast.error("An error occurred while deleting the user.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          setLoading(false);
        });
    }
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setLoading(true);
      axios
        .delete(
          `http://localhost:8080/registration/appointments/delete/${appointmentId}`
        )
        .then((response) => {
          toast.success("Appointment deleted successfully!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          setAppointments(
            appointments.filter(
              (appointment) => appointment.id !== appointmentId
            )
          );
          setLoading(false);
        })
        .catch((error) => {
          toast.error("An error occurred while deleting the appointment.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          setLoading(false);
        });
    }
  };

  const handleDeleteHospital = (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      setLoading(true);
      axios
        .delete(`http://localhost:8080/hospitals/delete/${hospitalId}`)
        .then((response) => {
          toast.success("Hospital deleted successfully!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
         // Remove the item from the list that matches the deleted expertise ID
          setHospitals((prevHospitals) =>
            prevHospitals.filter((hospital) => hospital.id !== hospitalId)
          );
          setLoading(false);
        })
        .catch((error) => {
          toast.error("An error occurred while deleting the hospital.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          setLoading(false);
        });
    }
  };

  const handleDeleteSpecialization = (specializationId) => {
    if (window.confirm("Are you sure you want to delete this clinic?")) {
      setLoading(true);
      axios
        .delete(
          `http://localhost:8080/specializations/delete/${specializationId}`
        )
        .then((response) => {
          toast.success("Clinic deleted successfully!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
        // Remove the item from the list that matches the deleted expertise ID
          setSpecialization((prevSpecializations) =>
            prevSpecializations.filter(
              (specialization) => specialization.id !== specializationId
            )
          );
          setLoading(false);
        })
        .catch((error) => {
          toast.error("An error occurred while deleting the clinic.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          setLoading(false);
        });
    }
  };

  const handleHospitalSubmit = () => {
    if (!hospitalName || !hospitalCity) {
      toast.error("Please fill all fields!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:8080/hospitals/add", {
        name: hospitalName,
        city: hospitalCity,
      })
      .then((response) => {
        toast.success("Hospital added successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setHospitalName("");
        setHospitalCity("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error("An error occurred while adding the hospital.", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
      });
  };

  const handleSpecializationSubmit = () => {
    if (!specializationName) {
      toast.error("Please fill all fields!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }
    setLoading(true);
    axios
      .post("http://localhost:8080/specializations/add", {
        name: specializationName,
      })
      .then((response) => {
        toast.success("Clinic added successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setSpecializationName("");
        setLoading(false);
      })
      .catch((error) => {
        toast.error("An error occurred while adding the hospital.", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setLoading(false);
      });
  };

  // Function for setting color and icon based on appointment status
  const getStatusStyle = (status) => {
    // If the status is empty, set it as 'unknown'
    if (!status) {
      return { color: "grey", icon: "question" };
    }
    switch (status.toLowerCase()) {
      case "pending":
        return { color: "orange", icon: "clock" };
      case "confirmed":
        return { color: "green", icon: "check" };
      case "cancelled":
        return { color: "red", icon: "cancel" };
      default:
        return { color: "grey", icon: "question" };
    }
  };

  <div style={{ marginBottom: "1em" }}>
  <Link to="/admin/add-ambulance" className="ui button primary">
    Add Ambulance
  </Link>
</div>
  
  // Defining the contents of the tabs
  const panes = [
    {
      menuItem: "Doctors",
      render: () => (
        <Tab.Pane>
          {loading && <Loader active inline="centered" />}
          {/* Flexbox layout for title and image */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
       
            <h2
              style={{
                fontSize: "2.5rem",
                color: "#2C3E50",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginRight: "15px",
                textTransform: "uppercase",
                borderBottom: "2px solid #3498db",
                paddingBottom: "10px",
              }}
            >
              Doctors
            </h2>

            <img
              src={medicalteam}
              alt="Doctors Icon"
              style={{ width: "60px", height: "60px", objectFit: "contain" }}
            />
          </div>
          <List divided verticalAlign="middle" style={styles.list}>
            {doctors.map((user) => (
              <List.Item key={user.id} style={styles.listItem}>
                <Image
                  avatar
                  src={
                    user.gender === "MALE"
                      ? "https://react.semantic-ui.com/images/avatar/small/mark.png"
                      : "https://react.semantic-ui.com/images/avatar/small/lindsay.png"
                  }
                />
                <List.Content style={styles.userInfo}>
                  <h4>
                    {user.firstName} {user.lastName}
                  </h4>
                  <p style={styles.userRole}>{user.role}</p>
                  <p style={styles.userRole}>{user.email}</p>
                </List.Content>
                <List.Content floated="right">
                  <Button color="blue" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                  <Button color="red" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Patients",
      render: () => (
        <Tab.Pane>
          {loading && <Loader active inline="centered" />}
        
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
           
            <h2
              style={{
                fontSize: "2.5rem",
                color: "#2C3E50",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginRight: "15px", 
                textTransform: "uppercase",
                borderBottom: "2px solid #3498db",
                paddingBottom: "10px",
              }}
            >
              Patients
            </h2>
           
            <img
              src={examination}
              alt="Patients Icon"
              style={{ width: "60px", height: "60px", objectFit: "contain" }}
            />
          </div>
          <List divided verticalAlign="middle" style={styles.list}>
            {patients.map((user) => (
              <List.Item key={user.id} style={styles.listItem}>
                <Image
                  avatar
                  src={
                    user.gender === "MALE"
                      ? "https://react.semantic-ui.com/images/avatar/small/mark.png"
                      : "https://react.semantic-ui.com/images/avatar/small/lindsay.png"
                  }
                />
                <List.Content style={styles.userInfo}>
                  <h4>
                    {user.firstName} {user.lastName}
                  </h4>
                  <p style={styles.userRole}>{user.role}</p>
                  <p style={styles.userRole}>{user.email}</p>
                </List.Content>
                <List.Content floated="right">
                  <Button color="blue" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                  <Button color="red" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Appointments",
      render: () => (
        <Tab.Pane>
          {loading && <Loader active inline="centered" />}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                color: "#2C3E50",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginRight: "15px",
                textTransform: "uppercase",
                borderBottom: "2px solid #3498db",
                paddingBottom: "10px",
              }}
            >
              Appointments
            </h2>
            <img
              src={medicalappointment}
              alt="Appointments Icon"
              style={{ width: "60px", height: "60px", objectFit: "contain" }}
            />
          </div>
          <List divided verticalAlign="middle" style={styles.appointmentList}>
            {appointments.map((appointment) => {
              const { color, icon } = getStatusStyle(appointment.status); // Style and icon based on status information
              return (
                <List.Item
                  key={appointment.id}
                  style={{
                    ...styles.appointmentItem,
                    backgroundColor: "#f9f9f9", // Light gray background
                    borderRadius: "10px", // Rounded corners
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
                    transition: "all 0.3s ease-in-out", // Smooth transition animation
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)"; // Enlargement on hover
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"; // Hover shadow effect
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // Restore original size after hover
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Normal shadow effect
                  }}
                >
                  <Grid>
                    <Grid.Row columns={3}>
                      <Grid.Column>
                        <p>
                          <strong>Date: </strong>
                          {appointment.day} at {appointment.time}
                        </p>
                        <p>
                          <strong>Hospital: </strong>
                          {appointment.doctor.hospital.name}
                        </p>
                        <p>
                          <strong>Clinic: </strong>
                          {appointment.doctor.specialization.name}
                        </p>
                      </Grid.Column>
                      <Grid.Column
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <p>
                          <strong>Doctor:</strong>
                          {appointment.doctor.user.firstName}{" "}
                          {appointment.doctor.user.lastName}
                        </p>
                        <p>
                          <strong>Patient:</strong>
                          {appointment.patient.user.firstName}{" "}
                          {appointment.patient.user.lastName}
                        </p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <Label
                          color={color}
                          size="large"
                          style={{
                            padding: "10px 15px",
                            fontSize: "1rem",
                            borderRadius: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          <Icon name={icon} /> {appointment.status || "Unknown"}
                        </Label>
                        <Button
                          color="red"
                          icon="trash"
                          size="small"
                          style={{
                            marginTop: "10px",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </List.Item>
              );
            })}
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Hospitals",
      render: () => (
        <Tab.Pane>
          {loading && <Loader active inline="centered" />}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                color: "#2C3E50",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginRight: "15px",
                textTransform: "uppercase",
                borderBottom: "2px solid #3498db",
                paddingBottom: "10px",
              }}
            >
              Hospitals
            </h2>
            <img
              src={hospital}
              alt="Hospitals Icon"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                transition: "all 0.3s ease",
              }}
            />
          </div>

          {/* Modal for editing hospital */}
          <Modal open={!!selectedHospital} onClose={handleCloseHospital}>
            <Modal.Header>Edit Hospital</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Input
                  label="Hospital Name"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                />
                <Form.Input
                  label="City"
                  value={hospitalCity}
                  onChange={(e) => setHospitalCity(e.target.value)}
                />
                <Button color="green" onClick={handleSubmitHospital}>
                  Save
                </Button>
                <Button color="red" onClick={handleCloseHospital}>
                  Cancel
                </Button>
              </Form>
            </Modal.Content>
          </Modal>

          {/* Hospital list */}
          <List divided verticalAlign="middle" style={styles.list}>
            {hospitals.map((hospital) => (
              <List.Item
                key={hospital.id}
                style={{
                  ...styles.listItem,
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <List.Content style={{ padding: "20px" }}>
                  <h4 style={{ color: "#2980b9" }}>{hospital.name}</h4>
                  <p>{hospital.city}</p>
                </List.Content>
                <List.Content
                  floated="right"
                  style={{ display: "flex", gap: "10px", marginLeft: "auto" }}
                >
                  <Button
                    color="blue"
                    onClick={() => handleEditHospital(hospital)}
                    style={{
                      transition: "all 0.3s ease",
                      marginBottom: "10px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    onClick={() => handleDeleteHospital(hospital.id)}
                    style={{
                      transition: "all 0.3s ease",
                      marginBottom: "10px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Delete
                  </Button>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Add Hospital",
      render: () => (
        <Tab.Pane>
          <Form onSubmit={handleHospitalSubmit}>
            <Form.Input
              label="Hospital Name"
              placeholder="Enter hospital name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
            <Form.Input
              label="Hospital City"
              placeholder="Enter hospital city"
              value={hospitalCity}
              onChange={(e) => setHospitalCity(e.target.value)}
            />
            <Form.Button color="green">Add Hospital</Form.Button>
          </Form>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Clinics",
      render: () => (
        <Tab.Pane>
          {loading && <Loader active inline="centered" />}
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                color: "#2C3E50",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginRight: "15px",
                textTransform: "uppercase",
                borderBottom: "2px solid #3498db",
                paddingBottom: "10px",
              }}
            >
              Clinics
            </h2>
          
            <img
              src={clinic}
              alt="Patients Icon"
              style={{ width: "60px", height: "60px", objectFit: "contain" }}
            />
          </div>

          {/* Modal for adding/editing specialization */}
          <Modal
            open={!!selectedSpecialization}
            onClose={handleCloseSpecialization}
          >
            <Modal.Header>Edit Clinic</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Input
                  label="Clinic Name"
                  value={specializationName}
                  onChange={(e) => setSpecializationName(e.target.value)}
                />
                <Button color="green" onClick={handleSubmitSpecialization}>
                  Save
                </Button>
                <Button color="red" onClick={handleCloseSpecialization}>
                  Cancel
                </Button>
              </Form>
            </Modal.Content>
          </Modal>

          {/* Specialization cards */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {specializations.map((specialization) => (
              <div
                key={specialization.id}
                style={{
                  ...styles.card,
                  margin: "10px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  borderRadius: "15px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div style={{ padding: "20px" }}>
                  <h4 style={{ color: "#2980b9" }}>{specialization.name}</h4>
                </div>
                <div style={{ padding: "10px", textAlign: "center" }}>
                  <Button
                    color="blue"
                    onClick={() => handleEditSpecialization(specialization)}
                    style={{
                      marginBottom: "10px",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2980b9")
                    } 
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#3498db")
                    } 
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    onClick={() =>
                      handleDeleteSpecialization(specialization.id)
                    }
                    style={{
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Tab.Pane>
      ),
    },

    {
      menuItem: "Add Clinic",
      render: () => (
        <Tab.Pane>
          <Form onSubmit={handleSpecializationSubmit}>
            <Form.Input
              label="Clinic Name"
              placeholder="Enter clinic name"
              value={specializationName}
              onChange={(e) => setSpecializationName(e.target.value)}
            />
            <Form.Button color="green">Add Clinic</Form.Button>
          </Form>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container style={styles.container}>
      <Segment raised>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <h2>Admin Dashboard</h2>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

    {/* Displaying the tabs */}
      <Tab
        panes={panes}
        activeIndex={activeTab}
        onTabChange={(e, { activeIndex }) => setActiveTab(activeIndex)}
        menu={{ fluid: true, vertical: true, tabular: true }} // Dikey menü
      />

      {/* Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="First Name"
              name="firstName"
              value={selectedUser?.firstName || ""}
              onChange={handleChange}
            />
            <Form.Input
              label="Last Name"
              name="lastName"
              value={selectedUser?.lastName || ""}
              onChange={handleChange}
            />
            <Form.Input
              label="Email"
              name="email"
              value={selectedUser?.email || ""}
              onChange={handleChange}
            />
            <Form.Input
              label="Role"
              name="role"
              value={selectedUser?.role || ""}
              onChange={handleChange}
            />
            <Form.Button color="green" onClick={handleSubmit}>
              Save
            </Form.Button>
          </Form>
        </Modal.Content>
      </Modal>

      {/* ToastContainer - Displays toast notifications on the screen */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="toast-container"
      />
      <div style={{ marginBottom: "1em" }}>
        <Link to="/admin/add-ambulance" className="ui button primary">
          Add Ambulance
        </Link>
      </div>
    </Container>
  );
}

const styles = {
  container: {
    marginTop: "2em",
    padding: "20px",
  },
  list: {
    marginTop: "20px",
  },
  listItem: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  userInfo: {
    marginLeft: "15px",
    fontSize: "16px",
  },
  userRole: {
    color: "#888",
    fontStyle: "italic",
  },
  appointmentList: {
    marginTop: "20px",
  },
  appointmentItem: {
    marginBottom: "15px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#f4f4f4",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },

  
};
