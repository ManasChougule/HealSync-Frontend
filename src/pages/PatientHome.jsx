import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Image,
  Container,
  Segment,
  Header,
  Dropdown,
  Card,
  Button,
  Form,
  Message,
  Tab,
  Label,
  Icon,
  Dimmer,
  Loader,
  Modal,
} from "semantic-ui-react";
import mhrsLogo from "../assets/mhrsLogo.png";
import { CSSTransition } from "react-transition-group";
import "../css/PatientHome.css";
import health from "../assets/health.png";
import timetable from "../assets/timetable.png";

const PatientHome = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [workingDaysOptions, setWorkingDaysOptions] = useState([]);
  const [workingHoursOptions, setWorkingHoursOptions] = useState([]);
  const [loading, setLoading] = useState(false);// Animation for page loading

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null); // Appointment details to be edited
  const [editDay, setEditDay] = useState(""); 
  const [editTime, setEditTime] = useState(""); 

  useEffect(() => {
    const userDataFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userDataFromStorage) {
      setUserData(userDataFromStorage);
      setUserName(
        `${userDataFromStorage.firstName} ${userDataFromStorage.lastName}`
      );
    }
  }, []);

const fetchDoctors = async (specializationName) => {
    setLoading(true); // Start loading animation
    try {
      const response = await axios.get(
        `http://localhost:8080/doctors/doctors?specializationName=${specializationName}`
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error occurred while fetching doctors:", error);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

    // Open form when Edit button is clicked
    const handleEditAppointment = (appointment) => {
    setEditAppointment(appointment);
    setEditDay(appointment.day); // Set default day to current appointment day
    setEditTime(appointment.time); // Set default time to current appointment time

    const doctor = appointment.doctor;
    const daysOptions = doctor.workingDays.split(",").map((day) => ({
        key: day,
        text: day,
        value: day,
    }));
    const hoursOptions = doctor.workingHours.split(",").map((hour) => ({
        key: hour,
        text: hour,
        value: hour,
    }));

    setWorkingDaysOptions(daysOptions);
    setWorkingHoursOptions(hoursOptions);

    setEditModalOpen(true); // Open the form modal
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
      }
    };

    fetchSpecializations();
  }, []);

  const fetchAppointments = async (patientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/appointments/patient/${patientId}`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("An error occurred while fetching appointments:", error);
    }
  };

  const handleSpecializationChange = (e, { value }) => {
    setSpecialization(value);
    fetchDoctors(value);
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDay("");
    setSelectedTime("");

    const daysOptions = doctor.workingDays.split(",").map((day) => ({
      key: day,
      text: day,
      value: day,
    }));
    const hoursOptions = doctor.workingHours.split(",").map((hour) => ({
      key: hour,
      text: hour,
      value: hour,
    }));

    setWorkingDaysOptions(daysOptions);
    setWorkingHoursOptions(hoursOptions);
  };

  const handleDeleteAppointment = async (appointmentId) => {
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
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "confirmed":
        return "green"; 
      case "cancelled":
        return "red";
      default:
        return "grey"; // Default color
    }
  }

  const handleAppointmentRequest = async () => {
    if (!userData) {
      alert("User information could not be loaded. Please log in.");
      return;
    }

    const patientId = userData.patientId;
    if (selectedDay && selectedTime && patientId && selectedDoctor) {
      try {
        const availabilityResponse = await axios.get(
          `http://localhost:8080/appointments/check-availability?doctorId=${selectedDoctor.id}&day=${selectedDay}&time=${selectedTime}`
        );

        if (availabilityResponse.status === 200) {
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

          if (appointmentResponse.status === 200) {
            setAppointmentSuccess(true);
            fetchAppointments(userData.patientId);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert("The doctor is not available at this time.");
        } else {
          alert("The appointment could not be saved. Please try again.");
        }
      }
    } else {
      alert("Please select a day and time or the patient ID is incorrect.");
    }
  };

  const handleUpdateAppointment = async () => {
    if (!editAppointment || !editDay || !editTime) {
      alert("Please select a day and time.");
      return;
    }

    try {
      // Availability check
      const availabilityResponse = await axios.get(
        `http://localhost:8080/appointments/check-availability?doctorId=${editAppointment.doctor.id}&day=${editDay}&time=${editTime}`
      );

      if (availabilityResponse.status === 200) {
        // Update appointment if available
        const response = await axios.put(
          `http://localhost:8080/appointments/update/${editAppointment.id}?day=${editDay}&time=${editTime}`
        );

        if (response.status === 200) {
            alert("Appointment successfully updated.");
            setEditModalOpen(false); // Close the form
            fetchAppointments(userData.patientId); // Reload updated appointments
        }
      }
    } catch (error) {
        console.error("An error occurred while updating the appointment:", error);
        alert("The doctor is not available at this time.");
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
    if (userData) {
      fetchAppointments(userData.patientId);
    }
  }, [userData]);

  const panes = [
    {
      menuItem: "Search Appointment",
      render: () => (
        <Tab.Pane attached={false}>
          <Segment raised>
            <Header as="h2" textAlign="center" style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                Search Appointment
                <img
                  src={health}
                  alt="stethoscope logo"
                  style={{ width: "49px", height: "40px" }}
                />
              </div>
            </Header>

            <Dropdown
              placeholder="Select Clinic"
              fluid
              selection
              options={specializationOptions}
              onChange={handleSpecializationChange}
              value={specialization}
              style={{ fontSize: "16px", marginBottom: "20px" }}
            />

            {loading ? (
              <Dimmer active inverted>
                <Loader>Loading Doctors...</Loader>
              </Dimmer>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {doctors.length === 0 ? (
                  <Message>No doctor found</Message>
                ) : (
                  doctors.map((doctor) => (
                    <CSSTransition
                      key={doctor.id}
                      timeout={500}
                      classNames="doctor-card"
                    >
                      <Card
                        raised
                        fluid
                        style={{
                          margin: "20px",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <Card.Content>
                          <Card.Header
                            style={{
                              fontSize: "1.5em",
                              fontWeight: "bold",
                              color: "#1b6d2f",
                            }}
                          >
                            {doctor.user.firstName} {doctor.user.lastName}
                          </Card.Header>
                          <Card.Meta
                            style={{
                              fontSize: "1.1em",
                              color: "#555",
                              marginBottom: "10px",
                            }}
                          >
                            {doctor.specialization.name}
                          </Card.Meta>
                          <Card.Description>
                            <p style={{ color: "#333", fontSize: "1em" }}>
                              <strong>Hospital:</strong> {doctor.hospital.name}
                            </p>
                            <p style={{ color: "#333", fontSize: "1em" }}>
                              <strong>Working Days:</strong>{" "}
                              {doctor.workingDays}
                            </p>
                            <p style={{ color: "#333", fontSize: "1em" }}>
                              <strong>Working Hours:</strong>{" "}
                              {doctor.workingHours}
                            </p>
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{
                                color: "#1b6d2f",
                                fontWeight: "bold",
                              }}
                            >
                              Request Appointment
                            </span>
                            <Icon name="arrow right" color="green" />
                          </div>
                        </Card.Content>
                      </Card>
                    </CSSTransition>
                  ))
                )}
              </div>
            )}

            {selectedDoctor && (
              <div>
                <Header
                  as="h3"
                  textAlign="center"
                  style={{ marginBottom: "20px" }}
                >
                  Make an Appointment with Dr. {selectedDoctor.user.firstName}{" "}
                  {selectedDoctor.user.lastName}
                </Header>

                <Form
                  success={appointmentSuccess}
                  warning={!appointmentSuccess}
                  size="large"
                >
                  {appointmentSuccess && (
                    <Message
                      success
                      header="Appointment Request Sent"
                      content="Your appointment has been saved successfully."
                    />
                  )}

                  <Form.Field>
                    <label>Select a day</label>
                    <Dropdown
                      placeholder="Select a day"
                      fluid
                      selection
                      options={workingDaysOptions}
                      onChange={(e, { value }) => setSelectedDay(value)}
                      value={selectedDay}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Select an hour</label>
                    <Dropdown
                      placeholder="Select an hour"
                      fluid
                      selection
                      options={workingHoursOptions}
                      onChange={(e, { value }) => setSelectedTime(value)}
                      value={selectedTime}
                    />
                  </Form.Field>

                  <Button
                    type="submit"
                    fluid
                    primary
                    onClick={handleAppointmentRequest}
                  >
                    Book Appointment
                  </Button>
                </Form>
              </div>
            )}
          </Segment>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Your Appointments",
      render: () => (
        <Tab.Pane attached={false}>
          <Segment
            raised
            style={{ backgroundColor: "#f9f9f9", padding: "20px" }}
          >
            <Header as="h2" textAlign="center" style={{ marginBottom: "30px" }}>
              Your Appointments
              <img src={timetable} alt="stethoscope logo" />
            </Header>

            {appointments.length === 0 ? (
              <Message>No appointments found</Message>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <Modal
                  open={editModalOpen}
                  onClose={() => setEditModalOpen(false)}
                  size="small"
                >
                  <Modal.Header>Edit Appointment</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Field>
                        <label>Select Day</label>
                        <Dropdown
                          placeholder="Select a day"
                          fluid
                          selection
                          options={workingDaysOptions}
                          onChange={(e, { value }) => setEditDay(value)}
                          value={editDay}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Select Time</label>
                        <Dropdown
                          placeholder="Select an hour"
                          fluid
                          selection
                          options={workingHoursOptions}
                          onChange={(e, { value }) => setEditTime(value)}
                          value={editTime}
                        />
                      </Form.Field>
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="black"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="green"
                      onClick={handleUpdateAppointment}
                      disabled={!editDay || !editTime}
                    >
                      Save
                    </Button>
                  </Modal.Actions>
                </Modal>

                {appointments.map((appointment) => (
                  <CSSTransition
                    key={appointment.id}
                    timeout={500}
                    classNames="appointment-card"
                  >
                    <Card
                      style={{
                        width: "300px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                        borderRadius: "12px",
                        overflow: "hidden",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <Card.Content>
                        <Card.Header
                          style={{
                            fontSize: "1.3em",
                            color: "#333",
                            marginBottom: "10px",
                          }}
                        >
                          {appointment.day} at {appointment.time}
                        </Card.Header>
                        <Card.Description>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "1.1em",
                              color: "#555",
                            }}
                          >
                            <strong>Doctor:</strong> Dr.{" "}
                            {appointment.doctor.user.firstName}{" "}
                            {appointment.doctor.user.lastName}
                          </p>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "1.1em",
                              color: "#555",
                            }}
                          >
                            <strong>Hospital:</strong>{" "}
                            {appointment.doctor.hospital.name}{" "}
                          </p>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "1.1em",
                              color: "#555",
                            }}
                          >
                            <strong>Clinic:</strong>{" "}
                            {appointment.doctor.specialization.name}{" "}
                          </p>
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            color="red"
                            icon
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                          >
                            <Icon name="trash" />
                          </Button>

                          <Button
                            color="blue"
                            icon
                            onClick={() => handleEditAppointment(appointment)}
                          >
                            <Icon name="edit" />
                          </Button>
                          <Label
                            color={getStatusColor(appointment.status)}
                            ribbon
                          >
                            {appointment.status}
                          </Label>
                        </div>
                      </Card.Content>
                    </Card>
                  </CSSTransition>
                ))}
              </div>
            )}
          </Segment>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container>
      <Image centered src={mhrsLogo} />
      <Header as="h2" textAlign="center" style={{ marginTop: "20px" }}>
        Welcome, {userName}!
      </Header>
      <Tab panes={panes} />
    </Container>
  );
};

export default PatientHome;
