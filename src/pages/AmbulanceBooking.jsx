import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AmbulanceBooking() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [availableAmbulances, setAvailableAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [message, setMessage] = useState('');
  
  // In a real application, you would retrieve the logged-in patient's ID from context or global state
  const patientId = 1; // Example: hardcoded for demonstration

  // Fetch available ambulances from the backend on component mount
  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        // If using a proxy, you can simply use the relative URL
        const response = await axios.get('http://localhost:8080/ambulance-bookings/available-ambulances');
        setAvailableAmbulances(response.data);
      } catch (error) {
        console.error('Error fetching ambulances:', error);
      }
    };
    fetchAmbulances();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    // Validate that an ambulance is selected
    if (!selectedAmbulance) {
      setMessage('Please select an ambulance.');
      return;
    }

    // Construct the DTO: note that we include ambulanceId along with other fields.
    const bookingDto = {
      patientId,
      ambulanceId: selectedAmbulance, // selectedAmbulance holds the id (number)
      pickupLocation,
      destination,
    };

    try {
      const response = await axios.post('http://localhost:8080/ambulance-bookings/book', bookingDto);
      setMessage(`Ambulance booked successfully! Booking ID: ${response.data.id}`);
    } catch (error) {
      console.error('Error booking ambulance:', error);
      const errorMsg = error.response?.data || error.message;
      setMessage('Error booking ambulance: ' + errorMsg);
    }
  };

  return (
    <div className="ui container">
      <h2>Ambulance Booking</h2>
      
      {/* Render the booking form */}
      <form className="ui form" onSubmit={handleBooking}>
        <div className="field">
          <label>Pickup Location:</label>
          <input 
            type="text" 
            value={pickupLocation} 
            onChange={(e) => setPickupLocation(e.target.value)} 
            placeholder="Enter pickup location" 
            required 
          />
        </div>
        <div className="field">
          <label>Destination (optional):</label>
          <input 
            type="text" 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            placeholder="Enter destination" 
          />
        </div>
        <div className="field">
          <label>Select an Ambulance:</label>
          <select 
            value={selectedAmbulance} 
            onChange={(e) => setSelectedAmbulance(e.target.value)}
            required
          >
            <option value="">-- Choose Ambulance --</option>
            {availableAmbulances.map((ambulance) => (
              <option key={ambulance.id} value={ambulance.id}>
                {ambulance.registrationNumber} - {ambulance.driverName} ({ambulance.status})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="ui primary button">Book Ambulance</button>
      </form>
      
      {message && <div className="ui message">{message}</div>}
    </div>
  );
}

export default AmbulanceBooking;
