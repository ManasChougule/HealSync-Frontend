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

  useEffect(() => {
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
        console.error("Error loading specializations:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (event) => {
    setFormData({ ...formData, role: event.target.value });
  };

  const handleGenderChange = (event) => {
    setFormData({ ...formData, gender: event.target.value });
  };

  const handleSpecializationChange = (event) => {
    setSpecialization(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerService = new RegisterService();

    try {
      const updatedFormData = { ...formData };
      if (formData.role === "DOCTOR") {
        updatedFormData.specializationId = specialization;
      }

      const response = await registerService.saveUser(updatedFormData);

      if (response.status === 200) {
        alert("Registration Successful!");
        navigate("/");
      } else {
        setErrorMessage("Registration Failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
          />
          <FormControl fullWidth margin="normal" sx={{ marginBottom: "20px" }}>
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
              <MenuItem value="" disabled></MenuItem>
              {genders.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </StyledSelect>
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
          />
          <FormControl fullWidth margin="normal" sx={{ marginBottom: "20px" }}>
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
              {roles.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          {formData.role === "DOCTOR" && (
            <FormControl fullWidth margin="normal" sx={{ marginBottom: "20px" }}>
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
