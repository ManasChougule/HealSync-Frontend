import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form, Tab, Tabs, Spinner, Card, ListGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminService from "../services/adminService";
import medicalteam from "../assets/medical-team.png";
import examination from "../assets/examination.png";
import medicalappointment from "../assets/medical-appointment.png";
import hospital from "../assets/hospital.png";
import clinic from "../assets/clinic.png";

const AdminHome = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [clinics, setClinics] = useState([]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [hospitalForm, setHospitalForm] = useState({ id: null, name: "", city: "" });
  const [clinicForm, setClinicForm] = useState({ id: null, name: "" });

  // Load data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [userRes, appointmentRes, hospitalRes, clinicRes] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllAppointments(),
        adminService.getAllHospitals(),
        adminService.getAllClinics(),
      ]);
      setDoctors(userRes.filter(u => u.role === "DOCTOR"));
      setPatients(userRes.filter(u => u.role === "PATIENT"));
      setAppointments(appointmentRes);
      setHospitals(hospitalRes);
      setClinics(clinicRes);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for User Edit
  const handleEditUser = user => {
    setSelectedUser({ ...user });
    setShowUserModal(true);
  };

  const handleUserChange = e => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  const saveUser = async () => {
    try {
      setLoading(true);
      await adminService.updateUser(selectedUser.id, selectedUser);
      toast.success("User updated");
      fetchAllData();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setShowUserModal(false);
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    try {
      setLoading(true);
      await adminService.deleteUser(id);
      toast.success("User deleted");
      fetchAllData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    try {
      setLoading(true);
      await adminService.deleteAppointment(id);
      toast.success("Appointment deleted");
      fetchAllData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const saveHospital = async () => {
    if (!hospitalForm.name || !hospitalForm.city) {
      toast.error("Fill all hospital fields");
      return;
    }
    try {
      setLoading(true);
      if (hospitalForm.id) {
        await adminService.updateHospital(hospitalForm.id, hospitalForm);
        toast.success("Hospital updated");
      } else {
        await adminService.addHospital(hospitalForm);
        toast.success("Hospital added");
      }
      setHospitalForm({ id: null, name: "", city: "" });
      fetchAllData();
    } catch {
      toast.error("Hospital save failed");
    } finally {
      setLoading(false);
    }
  };

  const editHospital = (hospital) => setHospitalForm(hospital);

  const deleteHospital = async (id) => {
    if (!window.confirm("Delete hospital?")) return;
    try {
      setLoading(true);
      await adminService.deleteHospital(id);
      toast.success("Hospital deleted");
      fetchAllData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const saveClinic = async () => {
    if (!clinicForm.name) {
      toast.error("Fill clinic name");
      return;
    }
    try {
      setLoading(true);
      if (clinicForm.id) {
        await adminService.updateClinic(clinicForm.id, clinicForm);
        toast.success("Clinic updated");
      } else {
        await adminService.addClinic(clinicForm);
        toast.success("Clinic added");
      }
      setClinicForm({ id: null, name: "" });
      fetchAllData();
    } catch {
      toast.error("Clinic save failed");
    } finally {
      setLoading(false);
    }
  };

  const editClinic = (clinic) => setClinicForm(clinic);

  const deleteClinic = async (id) => {
    if (!window.confirm("Delete clinic?")) return;
    try {
      setLoading(true);
      await adminService.deleteClinic(id);
      toast.success("Clinic deleted");
      fetchAllData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/add-ambulance" className="btn btn-primary mb-3">
        Add Ambulance
      </Link>

      <Tabs defaultActiveKey="doctors" id="admin-tabs" className="mb-3">
        <Tab eventKey="doctors" title="Doctors">
          {loading ? <Spinner animation="border" /> : doctors.map(doc => (
            <Card key={doc.id} className="mb-2">
              <Card.Body>
                <Card.Title>{doc.firstName} {doc.lastName}</Card.Title>
                <Card.Text>Email: {doc.email}</Card.Text>
                <Button variant="info" onClick={() => handleEditUser(doc)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => deleteUser(doc.id)}>Delete</Button>
              </Card.Body>
            </Card>
          ))}
        </Tab>

        <Tab eventKey="patients" title="Patients">
          {loading ? <Spinner animation="border" /> : patients.map(pt => (
            <Card key={pt.id} className="mb-2">
              <Card.Body>
                <Card.Title>{pt.firstName} {pt.lastName}</Card.Title>
                <Card.Text>Email: {pt.email}</Card.Text>
                <Button variant="info" onClick={() => handleEditUser(pt)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => deleteUser(pt.id)}>Delete</Button>
              </Card.Body>
            </Card>
          ))}
        </Tab>

        <Tab eventKey="appointments" title="Appointments">
          {loading ? <Spinner animation="border" /> : appointments.map(ap => (
            <Card key={ap.id} className="mb-2">
              <Card.Body>
                <Card.Text>
                  <strong>Date:</strong> {ap.day} {ap.time}<br />
                  <strong>Doctor:</strong> {ap.doctor.user.firstName} {ap.doctor.user.lastName}<br />
                  <strong>Patient:</strong> {ap.patient.user.firstName} {ap.patient.user.lastName}<br />
                  <Badge bg="secondary">{ap.status}</Badge>
                </Card.Text>
                <Button variant="danger" onClick={() => deleteAppointment(ap.id)}>Delete</Button>
              </Card.Body>
            </Card>
          ))}
        </Tab>

        <Tab eventKey="hospitals" title="Hospitals">
          {hospitals.map(hosp => (
            <Card key={hosp.id} className="mb-2">
              <Card.Body>
                <Card.Title>{hosp.name} ({hosp.city})</Card.Title>
                <Button variant="info" onClick={() => editHospital(hosp)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => deleteHospital(hosp.id)}>Delete</Button>
              </Card.Body>
            </Card>
          ))}
          <Form onSubmit={e => { e.preventDefault(); saveHospital(); }} className="mt-3">
            <Form.Control placeholder="Hospital Name" value={hospitalForm.name} onChange={e => setHospitalForm(prev => ({ ...prev, name: e.target.value }))} className="mb-2" />
            <Form.Control placeholder="City" value={hospitalForm.city} onChange={e => setHospitalForm(prev => ({ ...prev, city: e.target.value }))} className="mb-2" />
            <Button type="submit">{hospitalForm.id ? "Update" : "Add"} Hospital</Button>
          </Form>
        </Tab>

        <Tab eventKey="clinics" title="Clinics">
          {clinics.map(cl => (
            <Card key={cl.id} className="mb-2">
              <Card.Body>
                <Card.Title>{cl.name}</Card.Title>
                <Button variant="info" onClick={() => editClinic(cl)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => deleteClinic(cl.id)}>Delete</Button>
              </Card.Body>
            </Card>
          ))}
          <Form onSubmit={e => { e.preventDefault(); saveClinic(); }} className="mt-3">
            <Form.Control placeholder="Clinic Name" value={clinicForm.name} onChange={e => setClinicForm(prev => ({ ...prev, name: e.target.value }))} className="mb-2" />
            <Button type="submit">{clinicForm.id ? "Update" : "Add"} Clinic</Button>
          </Form>
        </Tab>
      </Tabs>

      {/* User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control name="firstName" value={selectedUser?.firstName || ""} onChange={handleUserChange} className="mb-2" placeholder="First Name" />
            <Form.Control name="lastName" value={selectedUser?.lastName || ""} onChange={handleUserChange} className="mb-2" placeholder="Last Name" />
            <Form.Control name="email" value={selectedUser?.email || ""} onChange={handleUserChange} className="mb-2" placeholder="Email" />
            <Form.Control name="role" value={selectedUser?.role || ""} onChange={handleUserChange} className="mb-2" placeholder="Role" />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveUser}>Save</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default AdminHome;
