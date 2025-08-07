import React, { useState } from "react";
import axios from "axios";

function AddAmbulance() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    driverName: "",
    type: "BASIC",
    available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/ambulances", formData);
      alert("Ambulance added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding ambulance:", error);
      alert("Failed to add ambulance.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Ambulance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vehicle Number:</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Driver Name:</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="BASIC">Basic</option>
            <option value="ICU">ICU</option>
            <option value="ADVANCED----">Advanced</option>
          </select>
        </div>
        <div>
          <label>Available:</label>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Ambulance</button>
      </form>
    </div>
  );
}

export default AddAmbulance;
