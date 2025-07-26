import React, { useState } from 'react';
import axios from 'axios';

function AddAmbulance() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAmbulance = {
      registrationNumber,
      driverName,
      status: 'AVAILABLE' // Default status
    };

    try {
      const response = await axios.post('http://localhost:8080/api/ambulances/add', newAmbulance);
      setMessage('Ambulance added successfully!');
      setRegistrationNumber('');
      setDriverName('');
    } catch (error) {
      console.error('Error adding ambulance:', error);
      setMessage('Error adding ambulance');
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
            required
          />
        </div>
        <div className="field">
          <label>Driver Name:</label>
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="ui primary button">Add Ambulance</button>
      </form>
      {message && <div className="ui message">{message}</div>}
    </div>
  );
}

export default AddAmbulance;
