import axios from "axios";

const API_BASE = "http://localhost:8080";

const doctorService = {
  getAllHospitals: async () => {
    const res = await axios.get(`${API_BASE}/hospitals/all`);
    return res.data.map(h => ({ id: h.id, name: h.name }));
  },

  getAllSpecializations: async () => {
    const res = await axios.get(`${API_BASE}/specializations/all`);
    return res.data.map(s => ({ id: s.id, name: s.name }));
  },

  getAppointmentsByDoctor: async (doctorId) => {
    const res = await axios.get(`${API_BASE}/appointments/doctor/${doctorId}`);
    return res.data;
  },

  getDoctorInfo: async (doctorId) => {
    const res = await axios.get(`${API_BASE}/doctors/${doctorId}`);
    return res.data;
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    await axios.put(`${API_BASE}/appointments/update-status/${appointmentId}?status=${status}`);
  },

  updateDoctorInfo: async (doctorId, doctorDetails) => {
    const data = {
      hospital: doctorDetails.hospital,
      specialization: doctorDetails.specialization,
      workingDays: doctorDetails.workingDays.join(","),
      workingHours: doctorDetails.workingHours.join(","),
    };
    await axios.put(`${API_BASE}/doctors/update/${doctorId}`, data);
  },
};

export default doctorService;
