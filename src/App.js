import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';
import DoctorHome from './pages/DoctorHome';
import PatientHome from './pages/PatientHome';
import AddAmbulance from './pages/AddAmbulance';
import BookAmbulance from './pages/BookAmbulance';
import 'bootstrap/dist/css/bootstrap.min.css';


import Header from './components/Header';
import Footer from './components/Footer';

function AppWrapper() {
  const location = useLocation();
  const hideHeaderFooterRoutes = []; // show header/footer on all pages

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/patient-home" element={<PatientHome />} />
        <Route path="/doctor-home" element={<DoctorHome />} />
        <Route path="/admin/add-ambulance" element={<AddAmbulance />} />
        <Route path="/book-ambulance" element={<BookAmbulance />} />
      </Routes>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
