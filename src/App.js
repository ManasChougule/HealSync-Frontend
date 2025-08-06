import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'; // Keep this line for Semantic UI styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are imported
import './App.css'; // Import your custom styles

// Import the new Header and Footer components
import Header from './components/Header';
import Footer from './components/Footer';

// Import your page components
import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';
import DoctorHome from './pages/DoctorHome';
import PatientHome from './pages/PatientHome';
import AmbulanceBooking from './pages/AmbulanceBooking'; // This component is imported but not used in routes
import AddAmbulance from './pages/AddAmbulance';
import BookAmbulance from './pages/BookAmbulance';

function App() {
  return (
    <Router>
      {/* Flex container to push footer to the bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header /> {/* Header will appear on all pages */}

        <main style={{ flexGrow: 1 }}> {/* Main content area will grow to fill space */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/patient-home" element={<PatientHome />} />
            <Route path="/doctor-home" element={<DoctorHome />} />
            <Route path="/admin/add-ambulance" element={<AddAmbulance />} />
            <Route path="/book-ambulance" element={<BookAmbulance />} />
            {/* Add more routes for your other pages here */}
          </Routes>
        </main>

        <Footer /> {/* Footer will appear on all pages */}
      </div>
    </Router>
  );
}

export default App;
