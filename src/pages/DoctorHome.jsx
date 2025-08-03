import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Alert, Tab, Tabs, Dropdown, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import doctorService from "../services/doctorService";
import stethoscope from "../assets/stethoscope.png";
import edit from "../assets/edit.png";
import timetable from "../assets/timetable.png";

export default function DoctorHome() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState({ hospital: "", specialization: "", workingDays: [], workingHours: [] });
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = Array.from({ length: 12 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setDoctorName(`${user.firstName} ${user.lastName}`);
      setDoctorId(user.doctorId);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      loadInitialData();
    }
  }, [doctorId]);

  const loadInitialData = async () => {
    try {
      const [hospitals, specializations, appointments, doctorInfo] = await Promise.all([
        doctorService.getAllHospitals(),
        doctorService.getAllSpecializations(),
        doctorService.getAppointmentsByDoctor(doctorId),
        doctorService.getDoctorInfo(doctorId),
      ]);

      setHospitalOptions(hospitals);
      setSpecializationOptions(specializations);
      setAppointments(appointments);

      setDoctorDetails({
        hospital: doctorInfo.hospital,
        specialization: doctorInfo.specialization,
        workingDays: doctorInfo.workingDays ? doctorInfo.workingDays.split(",") : [],
        workingHours: doctorInfo.workingHours ? doctorInfo.workingHours.split(",") : [],
      });

    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await doctorService.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev => prev.map(ap => ap.id === appointmentId ? { ...ap, status: newStatus } : ap));
      toast.success("Status updated");
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await doctorService.updateDoctorInfo(doctorId, doctorDetails);
      toast.success("Profile updated");
    } catch {
      toast.error("Profile update failed");
    }
  };

  const appointmentTab = (
    <>
      <h4><img src={timetable} alt="" width="30" className="me-2" />Appointments</h4>
      {loading ? <Spinner animation="border" /> : appointments.length === 0 ? <Alert>No Appointments</Alert> : appointments.map(ap => (
        <Card key={ap.id} className="mb-3">
          <Card.Body>
            <Card.Title>{ap.patient.user.firstName} {ap.patient.user.lastName}</Card.Title>
            <Card.Text>Day: {ap.day} | Time: {ap.time}</Card.Text>
            <Form.Select value={ap.status} onChange={e => handleStatusChange(ap.id, e.target.value)}>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Card.Body>
        </Card>
      ))}
    </>
  );

  const profileTab = (
    <>
      <h4><img src={edit} alt="" width="30" className="me-2" />Edit Profile</h4>
      <Form onSubmit={e => { e.preventDefault(); handleEditSubmit(); }}>
        <Form.Group className="mb-3">
          <Form.Label>Hospital</Form.Label>
          <Form.Select value={doctorDetails.hospital} onChange={e => setDoctorDetails({ ...doctorDetails, hospital: e.target.value })}>
            <option value="">Select Hospital</option>
            {hospitalOptions.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Specialization</Form.Label>
          <Form.Select value={doctorDetails.specialization} onChange={e => setDoctorDetails({ ...doctorDetails, specialization: e.target.value })}>
            <option value="">Select Specialization</option>
            {specializationOptions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Working Days</Form.Label>
          <Form.Control as="select" multiple value={doctorDetails.workingDays} onChange={e => setDoctorDetails({ ...doctorDetails, workingDays: Array.from(e.target.selectedOptions, opt => opt.value) })}>
            {daysOfWeek.map((day, idx) => <option key={idx} value={day}>{day}</option>)}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Working Hours</Form.Label>
          <Form.Control as="select" multiple value={doctorDetails.workingHours} onChange={e => setDoctorDetails({ ...doctorDetails, workingHours: Array.from(e.target.selectedOptions, opt => opt.value) })}>
            {hours.map((hr, idx) => <option key={idx} value={hr}>{hr}</option>)}
          </Form.Control>
        </Form.Group>

        <Button type="submit" style={{ backgroundColor: "#388e3c", borderColor: "#388e3c" }}>Save Changes</Button>
      </Form>
    </>
  );

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col><h2>Doctor Dashboard</h2></Col>
        <Col className="text-end"><h5>Welcome, {doctorName} <img src={stethoscope} alt="" width="40" /></h5></Col>
      </Row>

      <Tabs defaultActiveKey="appointments">
        <Tab eventKey="appointments" title="Appointments">{appointmentTab}</Tab>
        <Tab eventKey="profile" title="Edit Profile">{profileTab}</Tab>
      </Tabs>

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </Container>
  );
}
