import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';
import DoctorHome from './pages/DoctorHome';
import PatientHome from './pages/PatientHome';
import AmbulanceBooking from './pages/AmbulanceBooking';
import AddAmbulance from './pages/AddAmbulance';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/patient-home" element={<PatientHome />} />
        <Route path="/doctor-home" element={<DoctorHome />} />
        <Route path="/ambulance-booking" element={<AmbulanceBooking />} />
        <Route path="/admin/add-ambulance" element={<AddAmbulance />} />
      </Routes>
    </Router>
  );
}

export default App;
