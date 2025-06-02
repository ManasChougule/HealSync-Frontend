import React, { useState } from "react";
import axios from "axios";

function AddAmbulance() {
    
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ambulanceData = {
      registrationNumber,
      driverName,
      contactNumber,
      status,
    };

    try {
      const response = await axios.post("http://localhost:8080/ambulances/add", ambulanceData);
      setMessage(`Ambulance entry created successfully! ID: ${response.data.id}`);
    } 
    catch (error) {
  console.error("Error adding ambulance:", error);
  const errorMsg = error.response && error.response.data 
    ? JSON.stringify(error.response.data) 
    : error.message;
  setMessage("Error adding ambulance: " + errorMsg);
}

  };

  return (
    <div className="ui container">
      <h2>Add New Ambulance</h2>
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Registration Number:</label>
          <input 
            type="text" 
            value={registrationNumber} 
            onChange={(e) => setRegistrationNumber(e.target.value)} 
            placeholder="Enter registration number" 
            required 
          />
        </div>
        <div className="field">
          <label>Driver Name:</label>
          <input 
            type="text" 
            value={driverName} 
            onChange={(e) => setDriverName(e.target.value)} 
            placeholder="Enter driver name" 
            required 
          />
        </div>
        <div className="field">
          <label>Contact Number:</label>
          <input 
            type="text" 
            value={contactNumber} 
            onChange={(e) => setContactNumber(e.target.value)} 
            placeholder="Enter contact number" 
            required 
          />
        </div>
        <div className="field">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="ON_CALL">ON_CALL</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>
        </div>
        <button className="ui primary button" type="submit">Add Ambulance</button>
      </form>
      {message && <div className="ui message">{message}</div>}
    </div>
  );
}

export default AddAmbulance;
