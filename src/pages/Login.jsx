import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "../services/loginService";
import hospitalImage from "../assets/hospital.png";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const roles = [
    { value: "ADMIN", label: "Admin" },
    { value: "PATIENT", label: "Patient" },
    { value: "DOCTOR", label: "Doctor" },
  ];

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
        if (formData.role === "ADMIN") navigate("/admin-home");
        else if (formData.role === "PATIENT") navigate("/patient-home");
        else if (formData.role === "DOCTOR") navigate("/doctor-home");
      } else {
        setErrorMessage("Login Failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%", animation: "fadeIn 1s ease-in-out" }}>
        <div className="text-center mb-4">
          <img src={hospitalImage} alt="Hospital Logo" width="70" height="70" className="mb-2" style={{ transition: "transform 0.3s" }} />
          <h3 className="fw-bold text-success">Hospital Appointment System</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Select Role</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Role --</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errorMessage && (
            <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success btn-lg">Login</button>
          </div>
          <div className="text-center mt-3">
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                className="btn btn-link text-success fw-bold p-0"
                onClick={() => navigate("/register")}
              >
                Sign Up!
              </button>
            </span>
          </div>
        </form>

        {/* CSS animations inline */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          img:hover {
            transform: scale(1.1);
          }
          button:hover {
            transform: scale(1.03);
          }
        `}</style>
      </div>
    </div>
  );
}
