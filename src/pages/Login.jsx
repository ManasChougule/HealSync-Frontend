import React, { useState } from "react";
import {
  FormField,
  Button,
  Form,
  Container,
  Header,
  Message,
  Dropdown,
  Icon,
} from "semantic-ui-react";
import LoginService from "../services/loginService";
import { useNavigate } from "react-router-dom";
import hospitalImage from "../assets/hospital.png";

const roles = [
  { key: "ad", value: "ADMIN", text: "Admin" },
  { key: "pa", value: "PATIENT", text: "Patient" },
  { key: "do", value: "DOCTOR", text: "Doctor" },
];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e, { value }) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async () => {
    const loginService = new LoginService();
    try {

      const response = await loginService.login(formData);
      if (response.status === 200 && response.data) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        if (formData.role === "PATIENT") {
          localStorage.setItem("patientId", userData.id);
        }
        alert("Login Successful!");
        const role = formData.role;
        if (role === "ADMIN") {
          navigate("/admin-home");
        } else if (role === "PATIENT") {
          navigate("/patient-home");
        } else if (role === "DOCTOR") {
          navigate("/doctor-home");
        }
      } else {
        setErrorMessage("Login Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <Container style={styles.container}>
      <Header as="h2" textAlign="center" style={styles.header}>
        <img 
          src={hospitalImage} 
          alt="Hospital Logo" 
          style={styles.logo} 
        />
        <span>Welcome to the Hospital Appointment System</span>
      </Header>
      <Form onSubmit={handleSubmit} size="large" style={styles.form}>
        <FormField>
          <Dropdown
            clearable
            fluid
            selection
            options={roles}
            placeholder="Select Role"
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            style={styles.dropdown}
          />
        </FormField>
        <FormField>
          <input
            placeholder="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </FormField>
        <FormField>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
        </FormField>
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <Button type="submit" primary fluid size="large" style={styles.button}>
          Login
        </Button>
        <div style={styles.signupContainer}>
          <span>
            Don't have an account yet?{" "}
            <Button
              onClick={() => navigate("/register")}
              style={styles.linkButton}
            >
              Sign Up!
            </Button>
          </span>
        </div>
      </Form>
      
      {/* Dynamically adding style rules */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes fadeInForm {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          img:hover {
            transform: scale(1.1);
          }
          button:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </Container>
  );
}

const styles = {
  container: {
    marginTop: "7em",
    background: "linear-gradient(145deg, #f7f7f7, #e0e0e0)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    maxWidth: "450px",
    margin: "0 auto",
    animation: "fadeIn 1s ease-out",
  },
  header: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: "500",
    color: "#333",
    marginBottom: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    marginBottom: "10px",
    width: "60px",
    height: "60px",
    transition: "transform 0.3s ease",
  },
  input: {
    borderRadius: "5px",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  dropdown: {
    borderRadius: "5px",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    transition: "border 0.3s ease",
  },
  button: {
    borderRadius: "5px",
    background: "#388e3c",
    color: "#fff",
    padding: "15px",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  linkButton: {
    background: "transparent",
    color: "#388e3c",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  signupContainer: {
    marginTop: "15px",
    textAlign: "center",
  },
  form: {
    animation: "fadeInForm 1s ease-out",
  },
};
