import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AmbulanceBooking() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [availableAmbulances, setAvailableAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState('');
  
  const patientId = 1; // hardcoded or from session

  useEffect(() => {
    // Fetch available ambulances
    const fetchAmbulances = async () => {
      try {
        const res = await axios.get('http://localhost:8080/ambulance/available');
        setAvailableAmbulances(res.data);
      } catch (err) {
        console.error('Error fetching ambulances:', err);
      }
    };

    // Fetch hospitals
    const fetchHospitals = async () => {
      try {
        const res = await axios.get('http://localhost:8080/hospitals');
        setHospitals(res.data);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
      }
    };

    fetchAmbulances();
    fetchHospitals();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedAmbulance || !hospitalId || !pickupLocation) {
      setMessage('Please fill all fields.');
      return;
    }

    const bookingDto = {
      patientId,
      ambulanceId: selectedAmbulance,
      pickupLocation,
      hospitalId
    };

    try {
      const res = await axios.post('http://localhost:8080/ambulance/book', bookingDto);
      setMessage(res.data);

      // Refresh list
      const updated = await axios.get('http://localhost:8080/ambulance/available');
      setAvailableAmbulances(updated.data);
    } catch (err) {
      console.error('Booking failed:', err);
      setMessage('Booking failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="ui container">
      <h2>Book an Ambulance</h2>
      <form className="ui form" onSubmit={handleBooking}>
        <div className="field">
          <label>Pickup Location:</label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Drop Location (Hospital):</label>
          <select
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            required
          >
            <option value="">-- Select Hospital --</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Available Ambulances:</label>
          <select
            value={selectedAmbulance}
            onChange={(e) => setSelectedAmbulance(e.target.value)}
            required
          >
            <option value="">-- Select Ambulance --</option>
            {availableAmbulances.map(a => (
              <option key={a.id} value={a.id}>
                {a.registrationNumber} - {a.driverName}
              </option>
            ))}
          </select>
        </div>

        <button className="ui primary button" type="submit">Book</button>
      </form>
      {message && <div className="ui message">{message}</div>}
    </div>
  );
}

export default AmbulanceBooking;
