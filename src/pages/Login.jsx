import {  useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    Box,
} from "@mui/material";
import { styled } from "@mui/system";
import LoginService from "../services/loginService";
import { useNavigate } from "react-router-dom";
import hospitalImage from "../assets/hospital.png";
import '../css/Login.css';

const StyledContainer = styled(Box)(({ theme }) => ({
    marginTop: "4em",
    background: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
    maxWidth: "600px", 
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

export default function Login({setLoggedIn}) {
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
        try {
            const loginService = new LoginService();
            const response = await loginService.login({
                email: formData.email,
                password: formData.password
            }); 
            const userData = response.data; // { token, role, id }

            // Store complete user info
            localStorage.setItem("user", JSON.stringify(userData));
            setLoggedIn(true);
            alert("Login Successful!");

            // Navigate based on backend role
            switch (userData.role) {
                case "ADMIN": navigate("/admin-home"); break;
                case "PATIENT": navigate("/patient-home"); break;
                case "DOCTOR": navigate("/doctor-home"); break;
                default: setErrorMessage("Unknown role, cannot navigate."); break;
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage("Invalid credentials. Please check email/password.");
                } else {
                    setErrorMessage("An unexpected error occurred.");
                }
            } else {
                setErrorMessage("Network error. Please try again.");
            }
        }
    };


    return (
        <Container className="mt-4 mb-4">
            <StyledContainer>
                <Box className="header">
                    <img src={hospitalImage} alt="Hospital Logo" className="logo" />
                    <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
                        HealSync: Your Gateway to Better Healthcare Access
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} className="form">
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                        className="button"
                    >
                        Login
                    </Button>

                    <Box className="signupContainer">
                        <Typography variant="body2">
                            Don't have an account yet?{" "}
                            <Button
                                onClick={() => navigate("/register")}
                                className="linkButton"
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
