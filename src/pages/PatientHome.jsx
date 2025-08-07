import React, { useState, useEffect } from "react";
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
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

// Material-UI Imports (for specific components like Select/TextField if needed, or Typography)
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // For flexbox utilities
import CircularProgress from '@mui/material/CircularProgress'; // For loading indicator

// Icons (using react-icons for a mix, or you can use Material-UI Icons)
import { FaStethoscope, FaCalendarAlt, FaAmbulance, FaArrowLeft, FaSignOutAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';

// Local Assets
import HealSync from "../assets/HealSync.png";
import health from "../assets/health.png"; // Assuming these are still used for images
import timetable from "../assets/timetable.png";
import ambulanceIcon from "../assets/ambulance.png";

// You might need to adjust or remove this if all styling is handled by RB/MUI
// import "../css/PatientHome.css";

const PatientHome = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [workingDaysOptions, setWorkingDaysOptions] = useState([]);
  const [workingHoursOptions, setWorkingHoursOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [editDay, setEditDay] = useState("");
  const [editTime, setEditTime] = useState("");

  const [ambulanceNumber, setAmbulanceNumber] = useState("");
  const [ambulanceLocation, setAmbulanceLocation] = useState("");
  const [ambulanceNotes, setAmbulanceNotes] = useState("");
  const [ambulanceBookingSuccess, setAmbulanceBookingSuccess] = useState(false);
  const [ambulanceMessage, setAmbulanceMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userDataFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userDataFromStorage) {
      setUserData(userDataFromStorage);
      setUserName(
        `${userDataFromStorage.firstName} ${userDataFromStorage.lastName}`
      );
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchDoctors = async (specializationName) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/doctors/doctors?specializationName=${specializationName}`
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error occurred while fetching doctors:", error);
      alert("Failed to fetch doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditAppointment(appointment);
    setEditDay(appointment.day);
    setEditTime(appointment.time);

    const doctor = appointment.doctor;
    const daysOptions = doctor.workingDays
      ? doctor.workingDays.split(",").map((day) => ({
          key: day,
          text: day,
          value: day,
        }))
      : [];
    const hoursOptions = doctor.workingHours
      ? doctor.workingHours.split(",").map((hour) => ({
          key: hour,
          text: hour,
          value: hour,
        }))
      : [];

    setWorkingDaysOptions(daysOptions);
    setWorkingHoursOptions(hoursOptions);

    setEditModalOpen(true);
  };

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/specializations/all"
        );
        const options = response.data.map((specialization) => ({
          key: specialization.id,
          text: specialization.name,
          value: specialization.name,
        }));
        setSpecializationOptions(options);
      } catch (error) {
        console.error("Error occurred while fetching specializations:", error);
        alert("Failed to fetch specializations. Please try again later.");
      }
    };

    fetchSpecializations();
  }, []);

  const fetchAppointments = async (patientId) => {
    if (!patientId) {
      console.warn("Patient ID is missing, cannot fetch appointments.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/appointments/patient/${patientId}`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("An error occurred while fetching appointments:", error);
      alert("Failed to fetch your appointments. Please try again.");
    }
  };

  const handleSpecializationChange = (e) => { // e is the event object
    const value = e.target.value; // For MUI Select, value is directly on e.target.value
    setSpecialization(value);
    fetchDoctors(value);
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDay("");
    setSelectedTime("");
    setAppointmentSuccess(false);
    setAppointmentMessage("");
    // Clear message when a new doctor is selected
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime("");
    setAppointmentSuccess(false);
    setAppointmentMessage("");
    // Clear message when day changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setAppointmentSuccess(false);
    setAppointmentMessage("");
    // Clear message when time changes
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8080/registration/appointments/delete/${appointmentId}`
      );
      if (response.status === 200) {
        alert("Your appointment has been successfully deleted.");
        setAppointments(
          appointments.filter((appointment) => appointment.id !== appointmentId)
        );
      }
    } catch (error) {
      console.error("An error occurred while deleting the appointment:", error);
      alert("An error occurred while deleting the appointment.");
    }
  };

  function getStatusColor(status) {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "warning"; // Bootstrap variant
      case "confirmed":
        return "success"; // Bootstrap variant
      case "cancelled":
        return "danger"; // Bootstrap variant
      default:
        return "secondary"; // Bootstrap variant
    }
  }

  const handleAppointmentRequest = async () => {
    setAppointmentSuccess(false);
    setAppointmentMessage(""); // Clear previous messages immediately

    if (!userData || !userData.patientId) {
      setAppointmentMessage("User information (Patient ID) could not be loaded. Please log in again.");
      return;
    }

    const patientId = userData.patientId;
    if (!selectedDay || !selectedTime || !selectedDoctor) {
      setAppointmentMessage("Please select a doctor, day, and time for your appointment.");
      return;
    }

    try {
      const availabilityCheckData = {
        doctorId: selectedDoctor.id,
        day: selectedDay,
        time: selectedTime,
      };
      const availabilityResponse = await axios.post(
        "http://localhost:8080/appointments/check-availability",
        availabilityCheckData
      );

      if (availabilityResponse.data && availabilityResponse.data.includes("Doctor is available")) {
        const appointmentData = {
          doctorId: selectedDoctor.id,
          patientId: patientId,
          day: selectedDay,
          time: selectedTime,
        };

        const appointmentResponse = await axios.post(
          "http://localhost:8080/appointments/create",
          appointmentData
        );

        if (appointmentResponse.status === 200 || appointmentResponse.status === 201) {
          setAppointmentSuccess(true);
          setAppointmentMessage("Your appointment has been saved successfully!");
          fetchAppointments(userData.patientId); // Refresh appointments list

          // Introduce a delay before clearing the form fields
          setTimeout(() => {
            setSelectedDoctor(null);
            setSpecialization("");
            setSelectedDay("");
            setSelectedTime("");
            setAppointmentMessage(""); // Clear the success message after it's been seen
          }, 3000); // 3-second delay
        }
      } else {
          setAppointmentSuccess(false);
          setAppointmentMessage(availabilityResponse.data || "Doctor is not available at this time.");
      }
    } catch (error) {
      console.error("Error during appointment request:", error);
      setAppointmentSuccess(false);
      let msg = "An unknown error occurred. Please try again.";
      if (error.response) {
        if (typeof error.response.data === 'string') {
            msg = error.response.data;
        } else if (error.response.data && error.response.data.message) {
            msg = error.response.data.message;
        } else if (error.response.data) {
            msg = JSON.stringify(error.response.data);
        }
        setAppointmentMessage(`Booking failed: ${msg}`);
      } else if (error.request) {
        setAppointmentMessage("No response from server. Please check your network connection or try again later.");
      } else {
        setAppointmentMessage(`An error occurred: ${error.message}. Please try again.`);
      }
    }
  };

  const handleUpdateAppointment = async () => {
    if (!editAppointment || !editDay || !editTime) {
      alert("Please select a day and time for the update.");
      return;
    }

    try {
      const availabilityResponse = await axios.get(
        `http://localhost:8080/appointments/check-availability?doctorId=${editAppointment.doctor.id}&day=${editDay}&time=${editTime}`
      );

      if (availabilityResponse.data === true) {
        const response = await axios.put(
          `http://localhost:8080/appointments/update/${editAppointment.id}?day=${editDay}&time=${editTime}`
        );

        if (response.status === 200) {
          alert("Appointment successfully updated.");
          setEditModalOpen(false);
          fetchAppointments(userData.patientId);
        }
      } else {
          alert("The doctor is not available at this time for the update.");
      }
    } catch (error) {
      console.error("An error occurred while updating the appointment:", error);
      let errorMessage = "An unknown error occurred during update. Please try again.";
      if (error.response) {
        if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.response.data) {
            errorMessage = JSON.stringify(error.response.data);
        }
        if (error.response.status === 400) {
          alert(`Update failed: ${errorMessage || "The doctor is not available at this time for the update."}`);
        } else {
          alert(`An unexpected error occurred during update (Status: ${error.response.status}): ${errorMessage}`);
        }
      } else if (error.request) {
        alert("No response from server during update. Please check your network connection.");
      } else {
        alert(`An error occurred during update: ${error.message}.`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAmbulanceBooking = async () => {
    setAmbulanceBookingSuccess(false);
    setAmbulanceMessage("");

    if (!userData || !userData.patientId) {
      setAmbulanceMessage("User information (Patient ID) could not be loaded. Please log in again.");
      return;
    }

    const patientId = userData.patientId;
    if (!ambulanceLocation) {
      setAmbulanceMessage("Please provide your current location to book an ambulance.");
      return;
    }

    try {
      const ambulanceData = {
        patientId: patientId,
        ambulanceNumber: ambulanceNumber,
        location: ambulanceLocation,
        notes: ambulanceNotes,
      };

      const response = await axios.post(
        "http://localhost:8080/api/ambulance-bookings/book",
        ambulanceData
      );

      if (response.status === 200 || response.status === 201) {
        setAmbulanceBookingSuccess(true);
        setAmbulanceMessage("Your ambulance request has been sent successfully!");
        setAmbulanceNumber("");
        setAmbulanceLocation("");
        setAmbulanceNotes("");
      }
    } catch (error) {
      console.error("Error during ambulance booking:", error);
      setAmbulanceBookingSuccess(false);
      let msg = "An unknown error occurred. Please try again.";
      if (error.response) {
        if (typeof error.response.data === 'string') {
            msg = error.response.data;
        } else if (error.response.data && error.response.data.message) {
            msg = error.response.data.message;
        } else if (error.response.data) {
            msg = JSON.stringify(error.response.data);
        }
        setAmbulanceMessage(`Failed to book ambulance: ${msg}`);
      } else if (error.request) {
        setAmbulanceMessage("No response from server for ambulance booking. Please check your network connection.");
      } else {
        setAmbulanceMessage(`An error occurred during ambulance request: ${error.message}.`);
      }
    }
  };

  useEffect(() => {
    if (specialization) {
      fetchDoctors(specialization);
    } else {
      setDoctors([]);
    }
  }, [specialization]);

  useEffect(() => {
    if (userData && userData.patientId) {
      fetchAppointments(userData.patientId);
    }
  }, [userData]);

  return (
    <Container className="my-4">
      {/* Header Row */}
      <Row className="align-items-center mb-3">
        <Col xs={4} className="text-start">
          <img src={HealSync} alt="HealSync Logo" style={{ maxWidth: "150px" }} />
        </Col>
        <Col xs={4} className="text-center">
          <Typography variant="h4" component="h1" className="mb-0">
            Welcome, {userName}!
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
      <Tab.Container defaultActiveKey="searchAppointment">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="searchAppointment">Search Appointment</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="yourAppointments">Your Appointments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bookAmbulance">Book Ambulance</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Search Appointment Tab */}
          <Tab.Pane eventKey="searchAppointment">
            <Card className="shadow-sm p-4 mb-4">
              <Card.Body>
                <Typography variant="h5" component="h2" className="text-center mb-4">
                  Search Appointment <img src={health} alt="stethoscope logo" style={{ width: "40px", height: "35px", marginLeft: "10px" }} />
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="specialization-select-label">Select Clinic</InputLabel>
                  <Select
                    labelId="specialization-select-label"
                    id="specialization-select"
                    value={specialization}
                    label="Select Clinic"
                    onChange={handleSpecializationChange}
                  >
                    {specializationOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {loading ? (
                  <Box className="d-flex justify-content-center my-4">
                    <CircularProgress />
                    <Typography variant="body1" className="ms-2">Loading Doctors...</Typography>
                  </Box>
                ) : (
                  <Row xs={1} md={2} lg={3} className="g-4 mt-3">
                    {doctors.length === 0 ? (
                      <Col><Alert variant="info">No doctor found for this specialization.</Alert></Col>
                    ) : (
                      doctors.map((doctor) => (
                        <Col key={doctor.id}>
                          <Card
                            className="h-100 shadow-sm doctor-card"
                            style={{ cursor: "pointer", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                            onClick={() => handleDoctorSelect(doctor)}
                          >
                            <Card.Body>
                              <Card.Title className="text-success fw-bold fs-4">
                                Dr. {doctor.user.firstName} {doctor.user.lastName}
                              </Card.Title>
                              <Card.Subtitle className="mb-2 text-muted fs-6">
                                {doctor.specialization.name}
                              </Card.Subtitle>
                              <Card.Text>
                                <strong>Hospital:</strong> {doctor.hospital ? doctor.hospital.name : "N/A"}<br />
                                <strong>Working Days:</strong> {doctor.workingDays || "N/A"}<br />
                                <strong>Working Hours:</strong> {doctor.workingHours || "N/A"}
                              </Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between align-items-center text-success fw-bold">
                              Request Appointment <FaArrowLeft className="rotate-180" />
                            </Card.Footer>
                          </Card>
                        </Col>
                      ))
                    )}
                  </Row>
                )}

                {selectedDoctor && (
                  <Card className="shadow-sm p-4 mt-4">
                    <Card.Body>
                      <Typography variant="h6" component="h3" className="text-center mb-4">
                        Make an Appointment with Dr. {selectedDoctor.user.firstName}{" "}
                        {selectedDoctor.user.lastName}
                      </Typography>

                      {appointmentMessage && (
                        <Alert variant={appointmentSuccess ? "success" : "warning"}>
                          {appointmentSuccess ? "Appointment Request Sent" : "Appointment Failed"}: {appointmentMessage}
                        </Alert>
                      )}

                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Select a day</Form.Label>
                          <div className="d-flex flex-wrap gap-2">
                            {workingDaysOptions.length > 0 ? (
                              workingDaysOptions.map((option) => (
                                <Button
                                  key={option.value}
                                  variant={selectedDay === option.value ? "primary" : "light"}
                                  onClick={() => handleDaySelect(option.value)}
                                >
                                  {option.text}
                                </Button>
                              ))
                            ) : (
                              <Alert variant="info" className="w-100">No working days available for this doctor.</Alert>
                            )}
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Select an hour</Form.Label>
                          <div className="d-flex flex-wrap gap-2">
                            {workingHoursOptions.length > 0 ? (
                              workingHoursOptions.map((option) => (
                                <Button
                                  key={option.value}
                                  variant={selectedTime === option.value ? "primary" : "light"}
                                  onClick={() => handleTimeSelect(option.value)}
                                >
                                  {option.text}
                                </Button>
                              ))
                            ) : (
                              <Alert variant="info" className="w-100">No working hours available for this doctor.</Alert>
                            )}
                          </div>
                        </Form.Group>

                        <Button
                          type="button"
                          variant="primary"
                          className="w-100 mt-3"
                          onClick={handleAppointmentRequest}
                          disabled={!selectedDay || !selectedTime}
                        >
                          Book Appointment
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Your Appointments Tab */}
          <Tab.Pane eventKey="yourAppointments">
            <Card className="shadow-sm p-4 mb-4">
              <Card.Body>
                <Typography variant="h5" component="h2" className="text-center mb-4">
                  Your Appointments <img src={timetable} alt="timetable logo" style={{ width: "40px", height: "35px", marginLeft: "10px" }} />
                </Typography>

                {appointments.length === 0 ? (
                  <Alert variant="info">No appointments found</Alert>
                ) : (
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {appointments.map((appointment) => (
                      <Col key={appointment.id}>
                        <Card className="h-100 shadow-sm appointment-card">
                          <Card.Body>
                            <Card.Title className="fs-5">
                              {appointment.day} at {appointment.time}
                            </Card.Title>
                            <Card.Text>
                              <strong>Doctor:</strong> Dr.{" "}
                              {appointment.doctor.user.firstName}{" "}
                              {appointment.doctor.user.lastName}<br />
                              <strong>Hospital:</strong>{" "}
                              {appointment.doctor.hospital ? appointment.doctor.hospital.name : "N/A"}<br />
                              <strong>Clinic:</strong>{" "}
                              {appointment.doctor.specialization ? appointment.doctor.specialization.name : "N/A"}
                            </Card.Text>
                          </Card.Body>
                          <Card.Footer className="d-flex justify-content-between align-items-center">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                            >
                              <FaTrashAlt />
                            </Button>
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              <FaEdit />
                            </Button>
                            <span className={`badge bg-${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Book Ambulance Tab */}
          <Tab.Pane eventKey="bookAmbulance">
            <Card className="shadow-sm p-4 mb-4">
              <Card.Body>
                <Typography variant="h5" component="h2" className="text-center mb-4">
                  Book Ambulance <img src={ambulanceIcon} alt="ambulance logo" style={{ width: "40px", height: "35px", marginLeft: "10px" }} />
                </Typography>

                <Form>
                  {ambulanceMessage && (
                    <Alert variant={ambulanceBookingSuccess ? "success" : "warning"}>
                      {ambulanceBookingSuccess ? "Ambulance Request Sent" : "Ambulance Request Failed"}: {ambulanceMessage}
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Ambulance Number (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., AB1234"
                      value={ambulanceNumber}
                      onChange={(e) => setAmbulanceNumber(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Current Location <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 123 Main St, City"
                      value={ambulanceLocation}
                      onChange={(e) => { setAmbulanceLocation(e.target.value); setAmbulanceBookingSuccess(false); setAmbulanceMessage(""); }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Notes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="e.g., Patient has difficulty breathing."
                      value={ambulanceNotes}
                      onChange={(e) => setAmbulanceNotes(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleAmbulanceBooking}
                    disabled={!ambulanceLocation}
                  >
                    Request Ambulance
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Edit Appointment Modal */}
      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Day</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {workingDaysOptions.length > 0 ? (
                  workingDaysOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={editDay === option.value ? "primary" : "light"}
                      onClick={() => setEditDay(option.value)}
                    >
                      {option.text}
                    </Button>
                  ))
                ) : (
                  <Alert variant="info" className="w-100">No working days available for this doctor.</Alert>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Time</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {workingHoursOptions.length > 0 ? (
                  workingHoursOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={editTime === option.value ? "primary" : "light"}
                      onClick={() => setEditTime(option.value)}
                    >
                      {option.text}
                    </Button>
                  ))
                ) : (
                  <Alert variant="info" className="w-100">No working hours available for this doctor.</Alert>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdateAppointment} disabled={!editDay || !editTime}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientHome;
