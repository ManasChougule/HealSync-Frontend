import React, { useState, useEffect, useCallback } from "react";
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
import Modal from 'react-bootstrap/Modal';
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
import TextField from '@mui/material/TextField';

// Icons (using react-icons)
import { FaArrowLeft, FaSignOutAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';

// Local Assets
import HealSync from "../assets/HealSync.png";
import health from "../assets/health.png";
import timetable from "../assets/timetable.png";
import ambulanceIcon from "../assets/ambulance.png";

const PatientHome = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentMessage, setAppointmentMessage] = useState(""); // This state is for appointment booking messages
  const [appointments, setAppointments] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [workingDaysOptions, setWorkingDaysOptions] = useState([]);
  const [workingHoursOptions, setWorkingHoursOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [editDay, setEditDay] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editAppointmentMessage, setEditAppointmentMessage] = useState(""); // New state for edit modal messages
  const [editAppointmentSuccess, setEditAppointmentSuccess] = useState(false); // New state for edit modal success

  const [filteredTime, setFilteredTime] = useState([]);

  // Ambulance booking states
  const [patientName, setPatientName] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  const [ambulanceBookingSuccess, setAmbulanceBookingSuccess] = useState(false);
  const [ambulanceMessage, setAmbulanceMessage] = useState(""); // This state is for ambulance booking messages

  // Validation states for ambulance booking
  const [patientNameError, setPatientNameError] = useState("");
  const [pickupLocationError, setPickupLocationError] = useState("");
  const [dropLocationError, setDropLocationError] = useState("");
  const [ambulanceTypeError, setAmbulanceTypeError] = useState("");

  // Regex for validation
  const nameRegex = /^[a-zA-Z\s.'-]{2,}$/; // Allows letters, spaces, and common punctuation for names
  const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/; // Allows alphanumeric, spaces, and common punctuation for addresses

  const navigate = useNavigate();

  useEffect(() => {
    const userDataFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userDataFromStorage) {
      setUserData(userDataFromStorage);
      setUserName(
        `${userDataFromStorage.firstName} ${userDataFromStorage.lastName}`
      );
    } else {
      // If no user data, navigate to login/home page
      navigate("/");
    }
  }, [navigate]);

  const fetchDoctors = async (specializationName) => {
    setLoading(true);
    try {
      // TODO: Add JWT authentication check here
      const response = await axios.get(
        `http://localhost:8080/doctors/doctors?specializationName=${specializationName}`
      );
      setDoctors(response.data);
    } catch (error) {
      setAppointmentSuccess(false); // Assume failure if doctors can't be fetched
      setAppointmentMessage("Failed to fetch doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditAppointment(appointment);
    setEditDay(appointment.day);
    setEditTime(appointment.time);
    setEditAppointmentMessage(""); // Clear previous message
    setEditAppointmentSuccess(false); // Reset success state

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
        // TODO: Add JWT authentication check here
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
        // This error is for fetching specializations, not a specific appointment
        console.error("Failed to fetch specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  const fetchAppointments = async (patientId) => {
    if (!patientId) {
      return;
    }
    try {
      // TODO: Add JWT authentication check here
      const response = await axios.get(
        `http://localhost:8080/appointments/patient/${patientId}`
      );
      setAppointments(response.data);
    } catch (error) {
      // This error is for fetching the list of appointments, not a specific booking
      console.error("Failed to fetch your appointments:", error);
    }
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setSpecialization(value);
    fetchDoctors(value);
    setSelectedDoctor(null);
    setWorkingDaysOptions([]);
    setFilteredTime([]);
    setAppointmentMessage(""); // Clear appointment message on specialization change
    setAppointmentSuccess(false); // Reset success state
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDay("");
    setSelectedTime("");
    setAppointmentSuccess(false);
    setAppointmentMessage(""); // Clear appointment message on doctor select

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
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime("");
    setAppointmentSuccess(false);
    setAppointmentMessage(""); // Clear appointment message on day select
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setAppointmentSuccess(false);
    setAppointmentMessage(""); // Clear appointment message on time select
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      // TODO: Add JWT token to headers
      const response = await axios.delete(
        `http://localhost:8080/registration/appointments/delete/${appointmentId}`
      );
      if (response.status === 200) {
        setAppointments(
          appointments.filter((appointment) => appointment.id !== appointmentId)
        );
        setAppointmentSuccess(true);
        setAppointmentMessage("Your appointment has been successfully deleted.");
        setTimeout(() => setAppointmentMessage(""), 5000);
      }
    } catch (error) {
      setAppointmentSuccess(false);
      setAppointmentMessage("An error occurred while deleting the appointment.");
      setTimeout(() => setAppointmentMessage(""), 5000);
    }
  };

  function getStatusColor(status) {
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

  const handleAppointmentRequest = async () => {
    setAppointmentSuccess(false);
    setAppointmentMessage(""); // Clear previous message before new attempt

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
      // TODO: Add JWT token to headers
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

        // TODO: Add JWT token to headers
        const appointmentResponse = await axios.post(
          "http://localhost:8080/appointments/create",
          appointmentData
        );

        if (appointmentResponse.status === 200 || appointmentResponse.status === 201) {
          setAppointmentSuccess(true);
          // Updated success message for consistency
          setAppointmentMessage("Your appointment has been booked successfully!");
          fetchAppointments(userData.patientId); // Refresh appointments for "Your Appointments" tab

          // Clear selections after a short delay to allow the success message to be seen
          setTimeout(() => {
            setSelectedDoctor(null); // This will hide the booking card
            setSpecialization(""); // This will clear the specialization dropdown
            setSelectedDay("");
            setSelectedTime("");
            setAppointmentMessage(""); // Clear the message after a delay
          }, 3000); // Message visible for 3 seconds
        }
      } else {
          setAppointmentSuccess(false);
          setAppointmentMessage(availabilityResponse.data || "Doctor is not available at this time.");
      }
    } catch (error) {
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
    setEditAppointmentMessage(""); // Clear previous message
    setEditAppointmentSuccess(false); // Reset success state

    if (!editAppointment || !editDay || !editTime) {
      setEditAppointmentMessage("Please select a day and time for the update.");
      setEditAppointmentSuccess(false);
      return;
    }

    try {
      const availabilityCheckData = {
        doctorId: editAppointment.doctor.id,
        day: editDay,
        time: editTime,
      };
      // TODO: Add JWT authentication check here
      // Changed from axios.get to axios.post and sending data in body
      const availabilityResponse = await axios.post(
        "http://localhost:8080/appointments/check-availability",
        availabilityCheckData
      );

      // The backend response for availability check in handleAppointmentRequest
      // includes "Doctor is available". We should expect similar for consistency.
      // If the backend for update availability check returns a boolean true/false,
      // then `availabilityResponse.data === true` is correct.
      // If it returns a string like "Doctor is available", then adjust the condition.
      if (availabilityResponse.data === true || (typeof availabilityResponse.data === 'string' && availabilityResponse.data.includes("Doctor is available"))) {
        // TODO: Add JWT token to headers
        const response = await axios.put(
          `http://localhost:8080/appointments/update/${editAppointment.id}?day=${editDay}&time=${editTime}`
        );

        if (response.status === 200) {
          setEditAppointmentSuccess(true);
          setEditAppointmentMessage("Appointment successfully updated.");
          fetchAppointments(userData.patientId);
          // Close modal after a short delay to allow message to be seen
          setTimeout(() => setEditModalOpen(false), 1500);
        }
      } else {
          setEditAppointmentSuccess(false);
          // Use the message from the availability response if available, otherwise a default
          setEditAppointmentMessage(availabilityResponse.data || "The doctor is not available at this time for the update.");
      }
    } catch (error) {
      setEditAppointmentSuccess(false);
      let errorMessage = "An unknown error occurred during update. Please try again.";
      if (error.response) {
        if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.response.data) {
            errorMessage = JSON.stringify(error.response.data);
        }
        setEditAppointmentMessage(`Update failed: ${errorMessage}`);
      } else if (error.request) {
        setEditAppointmentMessage("No response from server during update. Please check your network connection.");
      } else {
        setEditAppointmentMessage(`An error occurred during update: ${error.message}.`);
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

  const validateAmbulanceBooking = () => {
    let isValid = true;

    // Validate Patient Name
    if (!patientName.trim()) {
      setPatientNameError("Patient name is required.");
      isValid = false;
    } else if (!nameRegex.test(patientName.trim())) { // Apply regex to trimmed value
      setPatientNameError("Enter a valid patient name (letters, spaces, and common punctuation only).");
      isValid = false;
    } else {
      setPatientNameError("");
    }

    // Validate Pickup Location
    if (!pickupLocation.trim()) {
      setPickupLocationError("Pickup location is required.");
      isValid = false;
    } else if (!addressRegex.test(pickupLocation.trim())) { // Apply regex to trimmed value
      setPickupLocationError("Enter a valid pickup address.");
      isValid = false;
    } else {
      setPickupLocationError("");
    }

    // Validate Drop Location
    if (!dropLocation.trim()) {
      setDropLocationError("Drop location is required.");
      isValid = false;
    } else if (!addressRegex.test(dropLocation.trim())) { // Apply regex to trimmed value
      setDropLocationError("Enter a valid drop address.");
      isValid = false;
    } else {
      setDropLocationError("");
    }

    // Validate Ambulance Type
    if (!ambulanceType) {
      setAmbulanceTypeError("Ambulance type is required.");
      isValid = false;
    } else {
      setAmbulanceTypeError("");
    }

    return isValid;
  };

  const handleAmbulanceBooking = async () => {
    setAmbulanceBookingSuccess(false);
    setAmbulanceMessage(""); // Clear previous message before new attempt

    if (!userData || !userData.patientId) {
      setAmbulanceMessage("User information (Patient ID) could not be loaded. Please log in again.");
      return;
    }

    if (!validateAmbulanceBooking()) {
      return; // Stop if validation fails
    }

    try {
      // Step 1: Get available ambulances of selected type
      // TODO: Add JWT token to headers
      const availableRes = await axios.get(
        `http://localhost:8080/api/ambulances/available?type=${ambulanceType}`
      );

      const availableAmbulances = availableRes.data;
      if (!availableAmbulances.length) {
        setAmbulanceMessage("No ambulances available for selected type.");
        return;
      }

      // Step 2: Pick the first available ambulance for booking
      const selectedAmbulance = availableAmbulances[0];

      const bookingData = {
        patientName: patientName.trim(),
        pickupLocation: pickupLocation.trim(),
        dropLocation: dropLocation.trim(),
        ambulanceId: selectedAmbulance.id,
        patientId: userData.patientId,
      };

      // Step 3: Send booking request
      // TODO: Add JWT token to headers
      const bookingRes = await axios.post("http://localhost:8080/api/booking", bookingData);

      if (bookingRes.status === 200 || bookingRes.status === 201) {
        setAmbulanceBookingSuccess(true);
        setAmbulanceMessage("Your ambulance request has been sent successfully!");
        // Clear form fields and validation errors on success
        setPatientName("");
        setPickupLocation("");
        setDropLocation("");
        setAmbulanceType("");
        setPatientNameError("");
        setPickupLocationError("");
        setDropLocationError("");
        setAmbulanceTypeError("");
      }
    } catch (error) {
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

  const fetchFilteredTimes = useCallback(async () => {
    if (selectedDoctor && selectedDoctor.id && selectedDay) {
      try {
        // TODO: Add JWT token to headers
        const response = await axios.post("http://localhost:8080/appointments/get-filtered-time", {
          doctorId: selectedDoctor.id,
          day: selectedDay,
        });
        setFilteredTime(response.data);
      } catch (error) {
        console.error("Error fetching filtered times:", error);
        setFilteredTime([]);
      }
    } else {
      setFilteredTime([]);
    }
  }, [selectedDoctor, selectedDay]);

  useEffect(() => {
    fetchFilteredTimes();
    setSelectedTime("");
    setAppointmentSuccess(false);
  }, [selectedDay, selectedDoctor, fetchFilteredTimes]);

  return (
    <Container className="my-4">
      {/* Header Row */}
      <Row className="align-items-center mb-3">
        <Col xs={4} className="text-start">
          <img src={HealSync} alt="HealSync Logo" style={{ maxWidth: "150px" }} />
        </Col>
        <Col xs={4} className="text-center">
          <Typography variant="h4" component="h1" className="mb-0">
            Welcome, <span style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#007bff' }}>{userName}</span>!
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

                      {/* Appointment Booking Message Display */}
                      {appointmentMessage && (
                        <Alert variant={appointmentSuccess ? "success" : "warning"}>
                          {appointmentMessage}
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
                            {filteredTime.length > 0 ? (
                              filteredTime.map((option) => (
                                <Button
                                  key={option}
                                  variant={selectedTime === option ? "primary" : "light"}
                                  onClick={() => handleTimeSelect(option)}
                                >
                                  {option}
                                </Button>
                              ))
                            ) : (
                              <Alert variant="info" className="w-100">Select a day to get available time slots.</Alert>
                            )}
                          </div>
                        </Form.Group>

                        <Button
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

                {/* Message for delete/update operations */}
                {appointmentMessage && ( // Re-using appointmentMessage for delete/update feedback
                  <Alert variant={appointmentSuccess ? "success" : "warning"}>
                    {appointmentMessage}
                  </Alert>
                )}

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

                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAmbulanceBooking(); }}>
                  {/* Ambulance Booking Message Display */}
                  {ambulanceMessage && (
                    <Alert variant={ambulanceBookingSuccess ? "success" : "warning"}>
                      {ambulanceMessage}
                    </Alert>
                  )}

                  <TextField
                    label="Patient Name"
                    value={patientName}
                    onChange={(e) => { setPatientName(e.target.value); setPatientNameError(""); }}
                    fullWidth
                    margin="normal"
                    required
                    error={!!patientNameError}
                    helperText={patientNameError}
                  />
                  <TextField
                    label="Pickup Location"
                    value={pickupLocation}
                    onChange={(e) => { setPickupLocation(e.target.value); setPickupLocationError(""); }}
                    fullWidth
                    margin="normal"
                    required
                    error={!!pickupLocationError}
                    helperText={pickupLocationError}
                  />
                  <TextField
                    label="Drop Location"
                    value={dropLocation}
                    onChange={(e) => { setDropLocation(e.target.value); setDropLocationError(""); }}
                    fullWidth
                    margin="normal"
                    required
                    error={!!dropLocationError}
                    helperText={dropLocationError}
                  />
                  <FormControl fullWidth margin="normal" error={!!ambulanceTypeError}>
                    <InputLabel id="ambulance-type-select-label">Ambulance Type</InputLabel>
                    <Select
                      labelId="ambulance-type-select-label"
                      id="ambulance-type-select"
                      value={ambulanceType}
                      label="Ambulance Type"
                      onChange={(e) => { setAmbulanceType(e.target.value); setAmbulanceTypeError(""); }}
                      required
                    >
                      <MenuItem value=""><em>Select Type</em></MenuItem>
                      <MenuItem value="BASIC">Basic</MenuItem>
                      <MenuItem value="ADVANCED">Advanced</MenuItem>
                      <MenuItem value="NEONATAL">Neonatal</MenuItem>
                      <MenuItem value="ICU">ICU</MenuItem>
                    </Select>
                    {ambulanceTypeError && <Typography color="error" variant="caption">{ambulanceTypeError}</Typography>}
                  </FormControl>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 mt-3"
                  >
                    Request Ambulance
                  </Button>
                </Box>
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
          {/* Message for edit modal operations */}
          {editAppointmentMessage && (
            <Alert variant={editAppointmentSuccess ? "success" : "warning"}>
              {editAppointmentMessage}
            </Alert>
          )}
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
