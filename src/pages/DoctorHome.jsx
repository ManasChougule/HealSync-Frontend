import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// React-Bootstrap Imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

// Material-UI Imports
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Icons from react-icons
import { FaStethoscope, FaEdit, FaCalendarAlt, FaArrowLeft, FaSignOutAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Local Assets (assuming these are still used for images)
import stethoscope from "../assets/stethoscope.png";
import edit from "../assets/edit.png";
import timetable from "../assets/timetable.png";

export default function DoctorHome() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState({
    hospital: "",
    specialization: "",
    workingDays: [], // Changed to array for multi-select
    workingHours: [], // Changed to array for multi-select
  });

  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);

  const navigate = useNavigate();

  // Dropdown options for working days
  const daysOfWeek = [
    { key: "mon", text: "Monday", value: "Monday" },
    { key: "tue", text: "Tuesday", value: "Tuesday" },
    { key: "wed", text: "Wednesday", value: "Wednesday" },
    { key: "thu", text: "Thursday", value: "Thursday" },
    { key: "fri", text: "Friday", value: "Friday" },
    { key: "sat", text: "Saturday", value: "Saturday" },
    { key: "sun", text: "Sunday", value: "Sunday" },
  ];

  // Dropdown options for working hours
  const hours = [
    { key: "08:00", text: "08:00", value: "08:00" },
    { key: "09:00", text: "09:00", value: "09:00" },
    { key: "10:00", text: "10:00", value: "10:00" },
    { key: "11:00", text: "11:00", value: "11:00" },
    { key: "12:00", text: "12:00", value: "12:00" },
    { key: "13:00", text: "13:00", value: "13:00" },
    { key: "14:00", text: "14:00", value: "14:00" },
    { key: "15:00", text: "15:00", value: "15:00" },
    { key: "16:00", text: "16:00", value: "16:00" },
    { key: "17:00", text: "17:00", value: "17:00" },
    { key: "18:00", text: "18:00", value: "18:00" },
    { key: "19:00", text: "19:00", value: "19:00" },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setDoctorName(`${user.firstName} ${user.lastName}`);
      setDoctorId(user.doctorId); // Retrieving the doctor ID
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/hospitals/all")
      .then((response) => {
        const options = response.data.map((hospital) => ({
          key: hospital.id,
          text: hospital.name,
          value: hospital.name,
        }));
        setHospitalOptions(options);
      })
      .catch((error) => {
        console.error("An error occurred while loading hospitals:", error);
        alert("An error occurred while loading hospitals.");
      });

    axios
      .get("http://localhost:8080/specializations/all")
      .then((response) => {
        const options = response.data.map((specialization) => ({
          key: specialization.id,
          text: specialization.name,
          value: specialization.name,
        }));
        setSpecializationOptions(options);
      })
      .catch((error) => {
        console.error(
          "An error occurred while loading specializations:",
          error
        );
        alert("An error occurred while loading specializations.");
      });

    if (doctorId) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/appointments/doctor/${doctorId}`)
        .then((response) => {
          setAppointments(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("An error occurred while loading appointments:", error);
          alert("An error occurred while loading appointments.");
          setLoading(false);
        });
    }
  }, [doctorId]);

  useEffect(() => {
    if (
      doctorId &&
      hospitalOptions.length > 0 &&
      specializationOptions.length > 0
    ) {
      axios
        .get(`http://localhost:8080/doctors/${doctorId}`)
        .then((response) => {
          const data = response.data;
          const hospitalOption = hospitalOptions.find(
            (option) => option.text === data.hospital
          );
          const specializationOption = specializationOptions.find(
            (option) => option.text === data.specialization
          );

          setDoctorDetails({
            hospital: hospitalOption ? hospitalOption.value : "",
            specialization: specializationOption
              ? specializationOption.value
              : "",
            workingDays: data.workingDays ? data.workingDays.split(",") : [],
            workingHours: data.workingHours ? data.workingHours.split(",") : [],
          });
        })
        .catch((error) => {
          console.error(
            "An error occurred while loading doctor information:",
            error
          );
        });
    }
  }, [doctorId, hospitalOptions, specializationOptions]);

  // Appointment statuses with react-icons
  const statusOptions = [
    {
      key: "pending",
      text: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaHourglassHalf style={{ color: "#FFA500", marginRight: '8px' }} /> Pending
        </Box>
      ),
      value: "PENDING",
    },
    {
      key: "confirmed",
      text: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaCheckCircle style={{ color: "#28a745", marginRight: '8px' }} /> Confirmed
        </Box>
      ),
      value: "CONFIRMED",
    },
    {
      key: "cancelled",
      text: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaTimesCircle style={{ color: "#dc3545", marginRight: '8px' }} /> Cancelled
        </Box>
      ),
      value: "CANCELLED",
    },
  ];

  // Function to send status update to the backend
  const handleStatusChange = (appointmentId, newStatus) => {
    axios
      .put(
        `http://localhost:8080/appointments/update-status/${appointmentId}?status=${newStatus}`
      )
      .then((response) => {
        setAppointments(
          appointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
        alert("Appointment status updated successfully!");
      })
      .catch((error) => {
        console.error(
          "An error occurred while updating the appointment status:",
          error
        );
        alert("An error occurred while updating the appointment status.");
      });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      hospital: doctorDetails.hospital,
      specialization: doctorDetails.specialization,
      workingDays: doctorDetails.workingDays ? doctorDetails.workingDays.join(",") : "",
      workingHours:  doctorDetails.workingHours ? doctorDetails.workingHours.join(",") : "",
    };

    try {
      const response = await axios.put(`http://localhost:8080/doctors/update/${doctorId}`, updateData);
      alert("Doctor information updated successfully!");
    } catch (error) {
      console.error(
        "An error occurred while updating doctor information:",
        error.response ? error.response.data : error.message
      );
      alert("An error occurred while updating doctor information.");
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Function to handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Helper to get Bootstrap variant for status
  function getStatusColorVariant(status) {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  }

  return (
    <Container className="my-4">
      {/* Header Row */}
      <Row className="align-items-center mb-3">
        <Col xs={4} className="text-start">
          <img src={stethoscope} alt="HealSync Logo" style={{ maxWidth: "150px" }} />
        </Col>
        <Col xs={4} className="text-center">
          <Typography variant="h4" component="h1" className="mb-0">
            Welcome, {doctorName}!
          </Typography>
        </Col>
        <Col xs={4} className="text-end">
          <Button variant="secondary" onClick={handleBack} className="me-2">
            <FaArrowLeft className="me-1" /> Back
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-1" /> Logout
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <Tab.Container defaultActiveKey="appointments">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="appointments">Appointments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="editProfile">Edit Profile</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Appointments Tab */}
          <Tab.Pane eventKey="appointments">
            <Card className="shadow-sm p-4 mb-4">
              <Card.Body>
                <Typography variant="h5" component="h2" className="text-center mb-4">
                  <img src={timetable} alt="Appointments" style={{ width: "40px", height: "35px", marginRight: "10px" }} />
                  Appointments
                </Typography>

                {loading ? (
                  <Box className="d-flex justify-content-center my-4">
                    <CircularProgress />
                    <Typography variant="body1" className="ms-2">Appointments are loading...</Typography>
                  </Box>
                ) : appointments.length > 0 ? (
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {appointments.map((appointment) => (
                      <Col key={appointment.id}>
                        <Card className="h-100 shadow-sm appointment-card">
                          <Card.Body>
                            <Card.Title className="fs-5">
                              {appointment.patient.user.firstName}{" "}
                              {appointment.patient.user.lastName}
                            </Card.Title>
                            <Card.Text>
                              Day: {appointment.day} | Time: {appointment.time}
                            </Card.Text>
                            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                              <InputLabel id={`status-select-label-${appointment.id}`}>Status</InputLabel>
                              <Select
                                labelId={`status-select-label-${appointment.id}`}
                                id={`status-select-${appointment.id}`}
                                value={appointment.status}
                                label="Status"
                                onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                renderValue={(selected) => {
                                  const option = statusOptions.find(opt => opt.value === selected);
                                  return option ? option.text : selected;
                                }}
                              >
                                {statusOptions.map((option) => (
                                  <MenuItem key={option.key} value={option.value}>
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Card.Body>
                          <Card.Footer className="d-flex justify-content-end">
                            <span className={`badge bg-${getStatusColorVariant(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Alert variant="info">No appointments available</Alert>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Edit Profile Tab */}
          <Tab.Pane eventKey="editProfile">
            <Card className="shadow-sm p-4 mb-4">
              <Card.Body>
                <Typography variant="h5" component="h2" className="text-center mb-4">
                  <img src={edit} alt="Edit Profile" style={{ width: "40px", height: "35px", marginRight: "10px" }} />
                  Edit Profile
                </Typography>
                <Form onSubmit={handleEditSubmit}>
                  {/* Hospital Dropdown */}
                  <Form.Group className="mb-3">
                    <Form.Label>Hospital</Form.Label>
                    <FormControl fullWidth>
                      <InputLabel id="hospital-select-label">Hospital</InputLabel>
                      <Select
                        labelId="hospital-select-label"
                        id="hospital-select"
                        value={doctorDetails.hospital}
                        label="Hospital"
                        onChange={(e) =>
                          setDoctorDetails({ ...doctorDetails, hospital: e.target.value })
                        }
                      >
                        {hospitalOptions.map((option) => (
                          <MenuItem key={option.key} value={option.value}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Form.Group>

                  {/* Specialization Dropdown */}
                  <Form.Group className="mb-3">
                    <Form.Label>Specialization</Form.Label>
                    <FormControl fullWidth>
                      <InputLabel id="specialization-select-label">Specialization</InputLabel>
                      <Select
                        labelId="specialization-select-label"
                        id="specialization-select"
                        value={doctorDetails.specialization}
                        label="Specialization"
                        onChange={(e) =>
                          setDoctorDetails({ ...doctorDetails, specialization: e.target.value })
                        }
                      >
                        {specializationOptions.map((option) => (
                          <MenuItem key={option.key} value={option.value}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Form.Group>

                  {/* Working Days Multi-select with smaller popup */}
                  <Form.Group className="mb-3">
                    <Form.Label>Working Days</Form.Label>
                    <FormControl fullWidth>
                      <InputLabel id="working-days-select-label">Working Days</InputLabel>
                      <Select
                        labelId="working-days-select-label"
                        id="working-days-select"
                        multiple
                        value={doctorDetails.workingDays}
                        label="Working Days"
                        onChange={(e) =>
                          setDoctorDetails({ ...doctorDetails, workingDays: e.target.value })
                        }
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Max height for the popup
                              width: 250,    // Max width for the popup
                            },
                          },
                        }}
                      >
                        {daysOfWeek.map((option) => (
                          <MenuItem key={option.key} value={option.value}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Form.Group>

                  {/* Working Hours Multi-select with smaller popup */}
                  <Form.Group className="mb-3">
                    <Form.Label>Working Hours</Form.Label>
                    <FormControl fullWidth>
                      <InputLabel id="working-hours-select-label">Working Hours</InputLabel>
                      <Select
                        labelId="working-hours-select-label"
                        id="working-hours-select"
                        multiple
                        value={doctorDetails.workingHours}
                        label="Working Hours"
                        onChange={(e) =>
                          setDoctorDetails({ ...doctorDetails, workingHours: e.target.value })
                        }
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Max height for the popup
                              width: 250,    // Max width for the popup
                            },
                          },
                        }}
                      >
                        {hours.map((option) => (
                          <MenuItem key={option.key} value={option.value}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100 mt-3">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}
