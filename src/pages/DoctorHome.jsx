import  { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

// React-Bootstrap Imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
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
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaChartBar } from 'react-icons/fa'; // Added FaChartBar

// Local Assets (assuming these are still used for images)
import stethoscope from "../assets/stethoscope.png";
import edit from "../assets/edit.png";
import timetable from "../assets/timetable.png";

import api from "../services/api";

// Recharts Imports for Bar Chart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts'; // Added LabelList

export default function DoctorHome() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState({
    hospital: "",
    specialization: "",
    workingDays: [],
    workingHours: [], 
  });

  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);


  const [doctorLoadData, setDoctorLoadData] = useState(null); // Stores the fetched doctor load data
  const [loadingDoctorLoad, setLoadingDoctorLoad] = useState(false); // Loading state for doctor load data

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
    const fetchDoctorId = async (userId) => {
        try {
        const response = await api.get(`/auth/doctorId-by-user/${userId}`);
        console.log('doc id for userId', userId,'is',response.data);
        setDoctorId(response.data); 
        } catch (error) {
            console.error("Failed to fetch doctor ID:", error);
            navigate("/");
        }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        setDoctorName(`${user.firstName} ${user.lastName}`);
        fetchDoctorId(user.userId);
    } else {
        navigate("/");
    }
    }, [navigate]);



  useEffect(() => {
    api
    .get("/hospitals/all")  
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
    });

    api
    .get("/specializations/all")
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
    });


    if (doctorId) {
        setLoading(true);
        api
        .get(`/appointments/doctor/${doctorId}`)
        .then((response) => {
            setAppointments(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("An error occurred while loading appointments:", error);
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

        api
        .get(`/doctors/${doctorId}`)
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
            specialization: specializationOption ? specializationOption.value : "",
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

  // MODIFIED useEffect to fetch doctor load data - now uses doctorId directly
  // This useEffect will now also re-run if 'appointments' state changes,
  // ensuring the chart updates when an appointment status is changed.
  useEffect(() => {
    const fetchDoctorLoadData = async () => {
      if (!doctorId) {
        setDoctorLoadData(null);
        return;
      }

      setLoadingDoctorLoad(true);
      try {
        const response = await api.get(`/appointments/doctor-load/${doctorId}`);  // Use doctorId directly
        setDoctorLoadData(response.data);
      } catch (error) {
        console.error("Error fetching doctor load data:", error);
        setDoctorLoadData(null);
      } finally {
        setLoadingDoctorLoad(false);
      }
    };

    fetchDoctorLoadData(); 
  }, [doctorId, appointments]); 

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
    api
    .put(
        `/appointments/update-status/${appointmentId}?status=${newStatus}`
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
      const response = await api.put(`/doctors/update/${doctorId}`, updateData);
      alert("Doctor information updated successfully!");
    } catch (error) {
      console.error(
        "An error occurred while updating doctor information:",
        error.response ? error.response.data : error.message
      );
    }
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

  // Function to prepare data for the Bar Chart (for grouped bars)
  const prepareChartData = (loadData) => {
    if (!loadData || !loadData.load) {
      return [];
    }
    // Map the load object into an array suitable for Recharts
    return Object.keys(loadData.load).map(day => ({
      day: day,
      Confirmed: loadData.load[day].confirmed,
      Pending: loadData.load[day].pending,
      Cancelled: loadData.load[day].cancelled,
      // Calculate total for tooltip or custom label if needed
      Total: loadData.load[day].confirmed + loadData.load[day].pending + loadData.load[day].cancelled,
    }));
  };

  // Custom Tooltip for the chart to show total count
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; 
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
          <p style={{ color: '#333', fontWeight: 'bold' }}>{`Total: ${data.Total}`}</p>
        </div>
      );
    }
    return null;
  };


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
          {/* NEW TAB */}
          <Nav.Item>
            <Nav.Link eventKey="doctorLoad">My Schedule Load</Nav.Link> {/* Changed tab name */}
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
                              maxHeight: 200, 
                              width: 250,    
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

          {/* NEW Doctor Load Tab - Modified to show only logged-in doctor's load */}
          <Tab.Pane eventKey="doctorLoad">
            <Card className="shadow-sm p-4 mb-4">
              <Card.Body>
                <Typography variant="h5" component="h2" className="text-center mb-4">
                  <FaChartBar style={{ width: "40px", height: "35px", marginRight: "10px", color: '#007bff' }} />
                  My Schedule Load - Day Wise
                </Typography>

                {loadingDoctorLoad ? (
                  <Box className="d-flex justify-content-center align-items-center my-5" sx={{ minHeight: 200 }}>
                    <CircularProgress size={50} />
                    <Typography variant="h6" className="ms-3 text-muted">Loading your schedule data...</Typography>
                  </Box>
                ) : doctorLoadData ? (
                  <Box sx={{ p: 3, borderRadius: '12px', mt: 4 }}> {/* Using Box instead of Paper for consistency with previous code */}
                    <Typography variant="h6" component="h3" className="mb-3 text-center" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Your Load Breakdown
                    </Typography>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={prepareChartData(doctorLoadData)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} content={<CustomTooltip />} /> {/* Use CustomTooltip */}
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="Confirmed" fill="#4CAF50" name="Confirmed">
                          <LabelList dataKey="Confirmed" position="top" />
                        </Bar>
                        <Bar dataKey="Pending" fill="#FFC107" name="Pending">
                          <LabelList dataKey="Pending" position="top" />
                        </Bar>
                        <Bar dataKey="Cancelled" fill="#F44336" name="Cancelled">
                          <LabelList dataKey="Cancelled" position="top" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Alert variant="info" className="mt-4 text-center">
                    <FaChartBar className="me-2" /> No schedule load data available for your account.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}
