import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import hospitalImage from "../assets/hospital.png";

const roles = ["ADMIN", "PATIENT", "DOCTOR"];
const genders = ["MALE", "FEMALE"];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "",
    gender: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [specialization, setSpecialization] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/specializations/all")
      .then((response) => {
        const options = response.data.map((spec) => ({
          id: spec.id,
          name: spec.name,
        }));
        setSpecializationOptions(options);
      })
      .catch((error) => {
        console.error("Error loading specializations:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, specializationId: specialization };

    try {
      const res = await axios.post("http://localhost:8080/registration/register", dataToSend);
      if (res.status === 200) {
        alert("Registration successful!");
        navigate("/");
      } else {
        setErrorMessage("Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Error during registration. Try again.");
    }
  };

  return (
    <Container style={{ maxWidth: "500px", marginTop: "50px" }}>
      <div className="text-center mb-4">
        <img src={hospitalImage} alt="Hospital" width="60" height="60" />
        <h2 style={{ color: "#388e3c" }}>Hospital Appointment System</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="gender" className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            {genders.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="role" className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            {roles.map((r, idx) => (
              <option key={idx} value={r}>{r}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {formData.role === "DOCTOR" && (
          <Form.Group controlId="specialization" className="mb-3">
            <Form.Label>Specialization</Form.Label>
            <Form.Select value={specialization || ""} onChange={(e) => setSpecialization(e.target.value)} required>
              <option value="">Select Specialization</option>
              {specializationOptions.map((spec) => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Button type="submit" style={{ backgroundColor: "#388e3c", borderColor: "#388e3c" }} className="w-100">Submit</Button>
      </Form>
      <div className="text-center mt-3">
        <p>
          Already have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/")}>Sign In!</span>
        </p>
      </div>
    </Container>
  );
}
