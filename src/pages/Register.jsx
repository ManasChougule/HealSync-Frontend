import React, { useEffect, useState } from "react";
import {
  FormField,
  Button,
  Form,
  Dropdown,
  Container,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import RegisterService from "../services/registerService";
import axios from "axios";
import hospitalImage from "../assets/hospital.png";

const roles = [
  { key: "ad", value: "ADMIN", text: "ADMIN" },
  { key: "pa", value: "PATIENT", text: "PATIENT" },
  { key: "do", value: "DOCTOR", text: "DOCTOR" },
];

const genders = [
  { key: "ma", value: "MALE", text: "MALE" },
  { key: "fe", value: "FEMALE", text: "FEMALE" },
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [specializationOptions, setSpecializationOptions] = useState([]);

  const [specialization, setSpecialization] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/specializations/all")
      .then((response) => {
        const options = response.data.map((specialization) => ({
          key: specialization.id,
          text: specialization.name,
          value: specialization.id,
        }));
        console.log("options="+options);
        setSpecializationOptions(options);
      })
      .catch((error) => {
        console.error("An error occurred while loading specializations:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e, { value }) => {
    setFormData({ ...formData, role: value });
  };

  const handleGenderChange = (e, { value }) => {
    setFormData({ ...formData, gender: value });
  };

  const handleSubmit = async () => {
    const registerService = new RegisterService();
    
    try {
      const updatedFormData = { ...formData, specializationId: specialization };
      const response = await registerService.saveUser(updatedFormData);
      
      if (response.status === 200) {
        if (updatedFormData.role === "DOCTOR" && updatedFormData.specializationId) {
          
          if (response.status === 200) {
            alert("Doctor registration successful with specialization!");
          } else {
            setErrorMessage("Doctor specialization registration failed.");
            return;
          }
        }
    
        alert("Registration Successful!");
        navigate("/"); 
      } else {
        setErrorMessage("Registration Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage(
        "An error occurred during registration. Please try again."
      );
    }
  };
  
  

  return (
    <Container style={styles.container}>
      <Header as="h2" textAlign="center" style={styles.header}>
      <img 
          src={hospitalImage} 
          alt="Hospital Logo" 
          style={{ marginBottom: "10px", width: "60px", height: "60px" }} 
        />
        <span>Hospital Appointment System</span>
      </Header>
      <Form onSubmit={handleSubmit} size="large">
        <FormField>
          <label>E-mail</label>
          <input
            placeholder="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </FormField>
        <FormField>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
        </FormField>

        <FormField>
          <label>Gender</label>
          <Dropdown
            clearable
            fluid
            selection
            options={genders}
            placeholder="Select Gender"
            name="gender"
            value={formData.gender}
            onChange={handleGenderChange}
            style={styles.dropdown}
          />
        </FormField>

        <FormField>
          <label>First Name</label>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={styles.input}
          />
        </FormField>
        <FormField>
          <label>Last Name</label>
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={styles.input}
          />
        </FormField>
        <FormField>
          <label>Role</label>
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
        {formData.role === "DOCTOR" && (
        <Form.Select
          label="Specialization"
          options={specializationOptions}
          value={specialization}
          onChange={(e, { value }) => setSpecialization(value)}
        />
      )}
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <Button type="submit" primary fluid size="large" style={styles.button}>
          Submit
        </Button>
      </Form>
      <div style={styles.linkContainer}>
        <p>
          Already have an account?
          <span style={styles.link} onClick={() => navigate("/")}>
            Sign In!
          </span>
        </p>
      </div>
    </Container>
  );
}

const styles = {
  container: {
    marginTop: "7em",
    background: "linear-gradient(145deg, #f7f7f7, #e0e0e0)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
    maxWidth: "450px",
    margin: "0 auto",
    animation: "fadeIn 1s ease-out",
  },
  header: {
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    borderRadius: "50px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    transition: "all 0.3s ease",
  },
  dropdown: {
    borderRadius: "50px",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    transition: "all 0.3s ease",
  },
  button: {
    borderRadius: "50px",
    background: "#388e3c",
    color: "#fff",
    padding: "15px",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      background: "#2c6b2f",
    },
  },
  linkContainer: {
    marginTop: "15px",
    textAlign: "center",
  },
  link: {
    color: "#388e3c",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`,
  styleSheet.cssRules.length
);
