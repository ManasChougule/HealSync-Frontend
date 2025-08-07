import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import RegisterService from "../services/registerService";
import axios from "axios";
import hospitalImage from "../assets/hospital.png";
import { Container } from "react-bootstrap";  // Import Container from React-Bootstrap

// Styled Box with responsive padding
const StyledContainer = styled(Box)(({ theme }) => ({
  marginTop: "4em",
  background: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
  maxWidth: "600px",  // Increased width
  margin: "0 auto",
  animation: "fadeIn 1s ease-out",
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    maxWidth: "90%",  // Still responsive on small screens
  },
}));

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    padding: "0px 15px",
    marginBottom: "20px",
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: "#ccc" },
  },
  "& .MuiInputLabel-root": { paddingLeft: "10px" },
  "& .MuiInputBase-input": { padding: "15px 0" },
});

const StyledSelect = styled(Select)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    padding: "0px 15px",
    marginBottom: "20px",
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: "#ccc" },
  },
  "& .MuiInputLabel-root": { paddingLeft: "10px" },
});

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
    gender: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [specialization, setSpecialization] = useState("");

  // Validation error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [specializationError, setSpecializationError] = useState("");

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const nameRegex = /^[A-Za-z\s]+$/;

  useEffect(() => {
    // TODO: Add JWT authentication check here (if this endpoint requires it)
    axios
      .get("http://localhost:8080/specializations/all")
      .then((response) => {
        const options = response.data.map((spec) => ({
          key: spec.id,
          text: spec.name,
          value: spec.id,
        }));
        setSpecializationOptions(options);
      })
      .catch((error) => {
        // Removed console.error
        setErrorMessage("Error loading specializations. Please try again.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear specific error when input changes
    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
    if (name === "firstName") setFirstNameError("");
    if (name === "lastName") setLastNameError("");
  };

  const handleRoleChange = (event) => {
    setFormData({ ...formData, role: event.target.value });
    setRoleError(""); // Clear error on change
    setSpecialization(""); // Clear specialization if role changes
    setSpecializationError(""); // Clear specialization error
  };

  const handleGenderChange = (event) => {
    setFormData({ ...formData, gender: event.target.value });
    setGenderError(""); // Clear error on change
  };

  const handleSpecializationChange = (event) => {
    setSpecialization(event.target.value);
    setSpecializationError(""); // Clear error on change
  };

  const validateForm = () => {
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!formData.password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      setPasswordError("Password must be 8+ characters, with letters and numbers.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // First Name validation
    if (!formData.firstName.trim()) {
      setFirstNameError("First Name is required.");
      isValid = false;
    } else if (!nameRegex.test(formData.firstName)) {
      setFirstNameError("First Name should contain only letters.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      setLastNameError("Last Name is required.");
      isValid = false;
    } else if (!nameRegex.test(formData.lastName)) {
      setLastNameError("Last Name should contain only letters.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Gender validation
    if (!formData.gender) {
      setGenderError("Gender is required.");
      isValid = false;
    } else {
      setGenderError("");
    }

    // Role validation
    if (!formData.role) {
      setRoleError("Role is required.");
      isValid = false;
    } else {
      setRoleError("");
    }

    // Specialization validation (only for DOCTOR role)
    if (formData.role === "DOCTOR" && !specialization) {
      setSpecializationError("Specialization is required for doctors.");
      isValid = false;
    } else if (formData.role === "DOCTOR") { // Clear error if it was set but now valid
      setSpecializationError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear general error message

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const registerService = new RegisterService();

    try {
      const updatedFormData = { ...formData };
      if (formData.role === "DOCTOR") {
        updatedFormData.specializationId = specialization;
      }

      // TODO: Add JWT token to headers (if registration endpoint requires it)
      const response = await registerService.saveUser(updatedFormData);

      if (response.status === 200) {
        alert("Registration Successful!");
        navigate("/");
      } else {
        setErrorMessage("Registration Failed. Please try again.");
      }
    } catch (error) {
      // Removed console.error
      setErrorMessage("An error occurred during registration. Please try again.");
    }
  };

  return (
    <Container className="mt-4 mb-4"> {/* Space above and below form */}
      <StyledContainer>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "25px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={hospitalImage}
            alt="Hospital Logo"
            style={{ marginBottom: "10px", width: "60px", height: "60px" }}
          />
          <span>Hospital Appointment System</span>
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}>
          <StyledTextField
            label="E-mail"
            placeholder="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!emailError}
            helperText={emailError}
          />
          <StyledTextField
            label="Password"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!passwordError}
            helperText={passwordError}
          />
          <FormControl fullWidth margin="normal" sx={{ marginBottom: "20px" }} error={!!genderError}>
            <InputLabel id="gender-label">Select Gender</InputLabel>
            <StyledSelect
              labelId="gender-label"
              id="gender-select"
              value={formData.gender}
              label="Gender"
              onChange={handleGenderChange}
              name="gender"
              displayEmpty
            >
              <MenuItem value="" disabled>Select Gender</MenuItem> {/* Added placeholder */}
              {genders.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </StyledSelect>
            {genderError && <Typography variant="caption" color="error">{genderError}</Typography>}
          </FormControl>
          <StyledTextField
            label="First Name"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!firstNameError}
            helperText={firstNameError}
          />
          <StyledTextField
            label="Last Name"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!lastNameError}
            helperText={lastNameError}
          />
          <FormControl fullWidth margin="normal" sx={{ marginBottom: "20px" }} error={!!roleError}>
            <InputLabel id="role-label">Select Role</InputLabel>
            <StyledSelect
              labelId="role-label"
              id="role-select"
              value={formData.role}
              label="Role"
              onChange={handleRoleChange}
              name="role"
              displayEmpty
            >
              <MenuItem value="" disabled>Select Role</MenuItem> {/* Added placeholder */}
              {roles.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </StyledSelect>
            {roleError && <Typography variant="caption" color="error">{roleError}</Typography>}
          </FormControl>

          {formData.role === "DOCTOR" && (
            <FormControl fullWidth margin="normal" sx={{ marginBottom: "20px" }} error={!!specializationError}>
              <InputLabel id="specialization-label">Specialization</InputLabel>
              <StyledSelect
                labelId="specialization-label"
                id="specialization-select"
                value={specialization}
                label="Specialization"
                onChange={handleSpecializationChange}
                name="specialization"
                displayEmpty
              >
                <MenuItem value="" disabled>Select Specialization</MenuItem>
                {specializationOptions.map((option) => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </StyledSelect>
              {specializationError && <Typography variant="caption" color="error">{specializationError}</Typography>}
            </FormControl>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              borderRadius: "50px",
              background: "#388e3c",
              color: "#fff",
              padding: "15px",
              fontWeight: "bold",
              marginTop: "20px",
              "&:hover": { background: "#2c6b2f" },
            }}
          >
            Submit
          </Button>
        </Box>
        <Box sx={{ marginTop: "15px", textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?
            <Typography
              component="span"
              onClick={() => navigate("/")}
              sx={{
                color: "#388e3c",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: "bold",
                ml: 0.5,
              }}
            >
              Sign In!
            </Typography>
          </Typography>
        </Box>
      </StyledContainer>
    </Container>
  );
}
