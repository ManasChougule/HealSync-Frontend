import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Modal, Form, Tab, Tabs, Spinner, Card, Dropdown, Alert, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import HealSync from "../assets/HealSync.png";
import adminService from "../services/adminService"; // Assuming API calls are similar

const PatientHome = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userFromStorage) {
      setUserData(userFromStorage);
      setUserName(`${userFromStorage.firstName} ${userFromStorage.lastName}`);
      fetchAppointments(userFromStorage.patientId);
    }
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/specializations/all");
      setSpecializations(res.data);
    } catch (err) {
      alert("Failed to fetch clinics");
    }
  };

  const fetchDoctors = async (specName) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/doctors/doctors?specializationName=${specName}`);
      setDoctors(res.data);
    } catch {
      alert("Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (patientId) => {
    try {
      const res = await axios.get(`http://localhost:8080/appointments/patient/${patientId}`);
      setAppointments(res.data);
    } catch {
      alert("Error fetching appointments");
    }
  };

  const bookAppointment = async () => {
    if (!selectedDoctor || !selectedDay || !selectedTime) {
      alert("Select doctor, day, and time");
      return;
    }
    try {
      const available = await axios.get(`http://localhost:8080/appointments/check-availability?doctorId=${selectedDoctor.id}&day=${selectedDay}&time=${selectedTime}`);
      if (available.status === 200) {
        const data = {
          doctorId: selectedDoctor.id,
          patientId: userData.patientId,
          day: selectedDay,
          time: selectedTime,
        };
        await axios.post("http://localhost:8080/appointments/create", data);
        alert("Appointment booked");
        fetchAppointments(userData.patientId);
      }
    } catch (err) {
      alert("Doctor not available at this time");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/registration/appointments/delete/${id}`);
      alert("Appointment deleted");
      fetchAppointments(userData.patientId);
    } catch {
      alert("Delete failed");
    }
  };

  const updateAppointment = async () => {
    try {
      const available = await axios.get(`http://localhost:8080/appointments/check-availability?doctorId=${editAppointment.doctor.id}&day=${selectedDay}&time=${selectedTime}`);
      if (available.status === 200) {
        await axios.put(`http://localhost:8080/appointments/update/${editAppointment.id}?day=${selectedDay}&time=${selectedTime}`);
        alert("Appointment updated");
        setEditModal(false);
        fetchAppointments(userData.patientId);
      }
    } catch {
      alert("Doctor not available at this time");
    }
  };

  const tabs = [
    {
      title: "Search Appointment",
      content: (
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Choose Clinic</Form.Label>
              <Form.Select value={selectedSpec} onChange={e => { setSelectedSpec(e.target.value); fetchDoctors(e.target.value); }}>
                <option value="">Select</option>
                {specializations.map(spec => (
                  <option key={spec.id} value={spec.name}>{spec.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {loading ? <Spinner animation="border" /> : (
              doctors.map(doc => (
                <Card key={doc.id} className="mb-2">
                  <Card.Body>
                    <Card.Title>Dr. {doc.user.firstName} {doc.user.lastName}</Card.Title>
                    <Card.Text>
                      Clinic: {doc.specialization.name}<br />
                      Hospital: {doc.hospital?.name}<br />
                      Days: {doc.workingDays}<br />
                      Hours: {doc.workingHours}
                    </Card.Text>
                    <Button onClick={() => setSelectedDoctor(doc)}>Book</Button>
                  </Card.Body>
                </Card>
              ))
            )}

            {selectedDoctor && (
              <>
                <h5>Book Appointment with Dr. {selectedDoctor.user.firstName}</h5>
                <Form.Group className="mb-2">
                  <Form.Label>Day</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Monday" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Time</Form.Label>
                  <Form.Control type="text" placeholder="e.g. 10:00 AM" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
                </Form.Group>
                <Button onClick={bookAppointment}>Book</Button>
              </>
            )}
          </Col>
        </Row>
      )
    },
    {
      title: "Your Appointments",
      content: (
        <Row className="justify-content-center">
          <Col md={8}>
            {appointments.length === 0 ? <Alert variant="info">No appointments</Alert> : appointments.map(ap => (
              <Card key={ap.id} className="mb-2">
                <Card.Body>
                  <Card.Title>{ap.day} at {ap.time}</Card.Title>
                  <Card.Text>
                    Doctor: {ap.doctor.user.firstName} {ap.doctor.user.lastName}<br />
                    Clinic: {ap.doctor.specialization.name}<br />
                    Hospital: {ap.doctor.hospital.name}<br />
                    Status: {ap.status}
                  </Card.Text>
                  <Button variant="danger" onClick={() => deleteAppointment(ap.id)}>Delete</Button>{' '}
                  <Button variant="info" onClick={() => { setEditAppointment(ap); setSelectedDay(ap.day); setSelectedTime(ap.time); setEditModal(true); }}>Edit</Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )
    }
  ];

  return (
    <Container className="mt-4 text-center">
      <img src={HealSync} alt="HealSync" style={{ maxWidth: "200px" }} className="mb-3" />
      <h3>Welcome, {userName}</h3>
      <Tabs defaultActiveKey="0" className="justify-content-center">
        {tabs.map((tab, idx) => (
          <Tab eventKey={idx.toString()} title={tab.title} key={idx}>
            <div className="mt-3">{tab.content}</div>
          </Tab>
        ))}
      </Tabs>

      <Link to="/book-ambulance" className="btn btn-primary mt-3">Book Ambulance</Link>

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Day</Form.Label>
            <Form.Control type="text" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Time</Form.Label>
            <Form.Control type="text" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={updateAppointment}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientHome;
