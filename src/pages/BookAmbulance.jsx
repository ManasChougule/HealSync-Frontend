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
    // Fetch available ambulances
    axios.get("http://localhost:8080/api/ambulances/available")
      .then(res => setAmbulances(res.data))
      .catch(err => console.error("Error loading ambulances:", err));

    // Fetch hospital list
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
    axios.post("http://localhost:8080/api/ambulance-bookings/book", formData)
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
    <div style={{ padding: "20px" }}>
      <h2>Book an Ambulance</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient Name:</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pickup Location:</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Select Ambulance:</label>
          <select
            name="ambulanceId"
            value={formData.ambulanceId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select --</option>
            {ambulances.map((amb) => (
              <option key={amb.id} value={amb.id}>
                {amb.numberPlate} - {amb.driverName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Hospital:</label>
          <select
            name="dropHospitalId"
            value={formData.dropHospitalId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select --</option>
            {hospitals.map((hos) => (
              <option key={hos.id} value={hos.id}>
                {hos.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Book Ambulance</button>
      </form>
    </div>
  );
}

export default BookAmbulance;
