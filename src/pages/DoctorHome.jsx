import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Segment,
  List,
  Message,
  Dropdown,
  Icon,
  Tab,
  Form,
  Button,
} from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import stethoscope from "../assets/stethoscope.png";
import edit from "../assets/edit.png";
import timetable from "../assets/timetable.png";

export default function DoctorHome() {
    const [doctorName, setDoctorName] = useState(""); // State to store doctor name
    const [doctorId, setDoctorId] = useState(""); // State to store doctor ID
    const [appointments, setAppointments] = useState([]); // State to store doctor's appointments
    const [loading, setLoading] = useState(false); // State for loading status
    const [doctorDetails, setDoctorDetails] = useState({
    hospital: "", 
    specialization: "", 
    workingDays: "", 
    workingHours: "",
    }); // State to store doctor details

  const [hospitalOptions, setHospitalOptions] = useState([]); // State to store hospital options
  const [specializationOptions, setSpecializationOptions] = useState([]); // State to store hospital options

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

  // Dropdown options for working hours - Time slots like 08:00, 09:00, 10:00, etc.
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
   // Retrieving the logged-in doctor's information from LocalStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setDoctorName(`${user.firstName} ${user.lastName}`);
      setDoctorId(user.doctorId); // Retrieving the doctor ID
    }
  }, []);

  useEffect(() => {
    // Fetching hospitals from the API
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
        toast.error("An error occurred while loading hospitals.");
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
        console.error("An error occurred while loading specializations:", error);
        toast.error("An error occurred while loading specializations.");
      });

    if (doctorId) {
      // API call to load appointments
      setLoading(true);
      axios
        .get(`http://localhost:8080/appointments/doctor/${doctorId}`)
        .then((response) => {
          setAppointments(response.data);
          setLoading(false);
        })
        .catch((error) => {
        console.error("An error occurred while loading appointments:", error);
        toast.error("An error occurred while loading appointments.");
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
     // Load doctor information
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
         console.error("An error occurred while loading doctor information:", error);
        });
    }
  }, [doctorId, hospitalOptions, specializationOptions]);

 // Appointment statuses
  const statusOptions = [
    {
      key: "pending",
      text: (
        <span>
          <Icon name="hourglass half" style={{ color: "#FFA500" }} /> Pending
        </span>
      ),
      value: "PENDING",
    },
    {
      key: "confirmed",
      text: (
        <span>
          <Icon name="check circle" style={{ color: "#28a745" }} /> Confirmed
        </span>
      ),
      value: "CONFIRMED",
    },
    {
      key: "cancelled",
      text: (
        <span>
          <Icon name="times circle" style={{ color: "#dc3545" }} /> Cancelled
        </span>
      ),
      value: "CANCELLED",
    },
  ];

  const handleChange = (e, { name, value }) => {
    setDoctorDetails({
      ...doctorDetails,
      [name]: value,
    });
  };

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
        toast.success("Appointment status updated successfully!");
      })
      .catch((error) => {
        console.error("An error occurred while updating the appointment status:", error);
        toast.error("An error occurred while updating the appointment status.");
      });
  };

  const handleEditSubmit = () => {
    const updateData = {
      hospital: doctorDetails.hospital,
      specialization: doctorDetails.specialization,
      workingDays: doctorDetails.workingDays ? doctorDetails.workingDays.join(",") : "",
      workingHours:  doctorDetails.workingHours ? doctorDetails.workingHours.join(",") : "",
    };

    axios
      .put(`http://localhost:8080/doctors/update/${doctorId}`, updateData)
      .then((response) => {
        toast.success("Doctor information updated successfully!");
      })
      .catch((error) => {
        console.error("An error occurred while updating doctor information:",
          error.response ? error.response.data : error.message);
       toast.error("An error occurred while updating doctor information.");
      });
  };

  // Tab options
  const panes = [
    {
      menuItem: "Appointments",
      render: () => (
        <Tab.Pane attached={false}>
          <h3 style={styles.header}>
            {" "}
            <img src={timetable} alt="Appointments" style={styles.icon} />{" "}
            Appointments
          </h3>
          {loading ? (
            <Message info>Appointments are loading...</Message>
          ) : appointments.length > 0 ? (
            <List divided relaxed>
              {appointments.map((appointment) => {
                const { color, icon } = getStatusStyles(appointment.status);
                return (
                  <List.Item key={appointment.id} style={styles.listItem}>
                    <List.Content>
                      <List.Header>
                        {appointment.patient.user.firstName}{" "}
                        {appointment.patient.user.lastName}
                      </List.Header>
                      <List.Description>
                        Day: {appointment.day} | Time: {appointment.time}
                      </List.Description>

                      {/* Status display and status update */}
                      <Grid.Row columns={2} verticalAlign="middle">
                        <Grid.Column textAlign="right">
                          <Dropdown
                            fluid
                            selection
                            options={statusOptions}
                            value={appointment.status}
                            onChange={(e, { value }) =>
                              handleStatusChange(appointment.id, value)
                            }
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          ) : (
            <Message info>No appointments available</Message>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Edit Profile",
      render: () => (
        <Tab.Pane>
          <h3 style={styles.header}>
            {" "}
            <img src={edit} alt="Appointments" style={styles.icon} /> Edit
            Profile
          </h3>
          <Form onSubmit={handleEditSubmit}>
            {/* Hospital Dropdown */}
            <Form.Field>
              <label>Hospital</label>
              <Dropdown
                fluid
                selection
                options={hospitalOptions}
                value={doctorDetails.hospital}
                onChange={(e, { value }) =>
                  setDoctorDetails({ ...doctorDetails, hospital: value , workingDays: doctorDetails.workingDays ? doctorDetails.workingDays.split(",") : [],
                    workingHours: doctorDetails.workingHours ? doctorDetails.workingHours.split(",") : [], })
                }
              />
            </Form.Field>

            {/* Expertise Dropdown */}
            <Form.Field>
              <label>Specialization</label>
              <Dropdown
                fluid
                selection
                options={specializationOptions}
                value={doctorDetails.specialization}
                onChange={(e, { value }) =>
                  setDoctorDetails({ ...doctorDetails, specialization: value })
                }
              />
            </Form.Field>
            <Form.Field>
              <label>Working Days</label>
              <Dropdown
                fluid
                multiple
                selection
                options={daysOfWeek}
                value={doctorDetails.workingDays}
                onChange={(e, { value }) =>
                  setDoctorDetails({ ...doctorDetails, workingDays: value })
                }
              />
            </Form.Field>

            <Form.Field>
              <label>Working Hours</label>
              <Dropdown
                fluid
                multiple
                selection
                options={hours}
                value={doctorDetails.workingHours}
                onChange={(e, { value }) =>
                  setDoctorDetails({ ...doctorDetails, workingHours: value })
                }
              />
            </Form.Field>

            <Button type="submit" color="blue">
              Save Changes
            </Button>
          </Form>
        </Tab.Pane>
      ),
    },
  ];

    // Colored styling and icons for status
  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return { color: "#FFA500", icon: "hourglass half" };
      case "CONFIRMED":
        return { color: "#28a745", icon: "check circle" };
      case "CANCELLED":
        return { color: "#dc3545", icon: "times circle" };
      default:
        return { color: "#6c757d", icon: "question circle" };
    }
  };

  return (
    <Container style={styles.container}>
      <Segment raised>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <h2>Doctor Dashboard</h2>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <h3>
                Welcome, {doctorName}!{" "}
                <img
                  src={stethoscope}
                  alt="stethoscope logo"
                  style={styles.logo}
                />
              </h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      {/* Tab Component */}
      <Tab panes={panes} />

      {/* ToastContainer */}
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
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  dropdown: {
    width: "150px",
    marginTop: "10px",
  },
  logo: {
    width: "40px",
    height: "40px", 
    marginRight: "10px", 
  },
  icon: {
    width: "45px", 
    height: "45px", 
    marginRight: "10px", 
  },
  header: {
    display: "flex", 
    alignItems: "center", 
  },
};
