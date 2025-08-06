import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import LoginService from "../services/loginService";
import { useNavigate } from "react-router-dom";
import hospitalImage from "../assets/hospital.png";

// Styled Box for wider responsive form container
const StyledContainer = styled(Box)(({ theme }) => ({
  marginTop: "4em",
  background: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
  maxWidth: "600px",  // Increased width
  margin: "0 auto",
  animation: "fadeIn 1s ease-out",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(145deg, rgba(187,222,251,0.8), rgba(227,242,253,0.8))",
    zIndex: -1,
    animation: "pulse 6s infinite alternate",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    maxWidth: "90%",
  },
}));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <Container className="mt-4 mb-4">
      <StyledContainer>
        <Box sx={styles.header}>
          <img src={hospitalImage} alt="Hospital Logo" style={styles.logo} />
          <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
            Welcome to the Hospital Appointment System
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <FormControl fullWidth sx={styles.input}>
            <InputLabel>Select Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Select Role"
              onChange={handleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role.key} value={role.value}>
                  {role.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={styles.input}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={styles.input}
          />

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={styles.button}
          >
            Login
          </Button>

          <Box sx={styles.signupContainer}>
            <Typography variant="body2">
              Don't have an account yet?{" "}
              <Button
                onClick={() => navigate("/register")}
                sx={styles.linkButton}
              >
                Sign Up!
              </Button>
            </Typography>
          </Box>
        </Box>
      </StyledContainer>
    </Container>
  );
}

const styles = {
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mb: 4,
  },
  logo: {
    width: "60px",
    height: "60px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  input: {
    mb: 2,
  },
  button: {
    mt: 3,
    backgroundColor: "#388e3c",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#2e7d32",
      transform: "scale(1.05)",
    },
  },
  linkButton: {
    color: "#388e3c",
    textDecoration: "underline",
    fontWeight: "bold",
    p: 0,
    minWidth: 0,
  },
  signupContainer: {
    mt: 2,
    textAlign: "center",
  },
  form: {
    animation: "fadeInForm 1s ease-out",
  },
};
