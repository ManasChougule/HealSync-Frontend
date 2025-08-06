// pages/BookAmbulance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function BookAmbulance() {
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    pickupLocation: "",
    dropHospitalId: "",
    ambulanceId: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/ambulances/available")
      .then(res => setAmbulances(res.data))
      .catch(err => console.error("Error loading ambulances:", err));

    axios.get("http://localhost:8080/hospitals/all")
      .then(res => setHospitals(res.data))
      .catch(err => console.error("Error loading hospitals:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      patientName: formData.patientName,
      age: parseInt(formData.age),
      pickupLocation: formData.pickupLocation,
      ambulanceId: parseInt(formData.ambulanceId),
      hospitalId: parseInt(formData.dropHospitalId),
    };

    axios.post("http://localhost:8080/api/ambulance-bookings/book", payload)
      .then(res => {
        setMessage("🚑 Ambulance booked successfully!");
        setFormData({
          patientName: "",
          age: "",
          pickupLocation: "",
          dropHospitalId: "",
          ambulanceId: ""
        });
      })
      .catch(err => {
        console.error("Booking failed:", err);
        setMessage("❌ Failed to book ambulance.");
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🚑 Book an Ambulance</h2>
      {message && <p style={styles.message}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Patient Name:</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Pickup Location:</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Select Ambulance:</label>
          <select
            name="ambulanceId"
            value={formData.ambulanceId}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">-- Select --</option>
            {ambulances.map((amb) => (
              <option key={amb.id} value={amb.id}>
                {amb.numberPlate} - {amb.driverName}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Select Hospital:</label>
          <select
            name="dropHospitalId"
            value={formData.dropHospitalId}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">-- Select --</option>
            {hospitals.map((hos) => (
              <option key={hos.id} value={hos.id}>
                {hos.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={styles.button}>
          Book Ambulance
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  field: {
    marginBottom: "15px"
  },
  label: {
    marginBottom: "5px",
    display: "block",
    fontWeight: "bold",
    color: "#555"
  },
  input: {
    padding: "8px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  select: {
    padding: "8px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  message: {
    textAlign: "center",
    marginBottom: "15px",
    fontWeight: "bold"
  }
};

export default BookAmbulance;


