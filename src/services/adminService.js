import axios from "axios";

const API_BASE = "http://localhost:8080";

const adminService = {
  getAllUsers: async () => {
    const res = await axios.get(`${API_BASE}/registration/all?role=ADMIN`);
    return res.data;
  },

  getAllAppointments: async () => {
    const res = await axios.get(`${API_BASE}/registration/appointments?role=ADMIN`);
    return res.data;
  },

  getAllHospitals: async () => {
    const res = await axios.get(`${API_BASE}/hospitals/all`);
    return res.data;
  },

  getAllClinics: async () => {
    const res = await axios.get(`${API_BASE}/specializations/all`);
    return res.data;
  },

  updateUser: async (id, userData) => {
    await axios.put(`${API_BASE}/registration/update/${id}`, userData);
  },

  deleteUser: async (id) => {
    await axios.delete(`${API_BASE}/registration/delete/${id}`);
  },

  deleteAppointment: async (id) => {
    await axios.delete(`${API_BASE}/registration/appointments/delete/${id}`);
  },

  addHospital: async (hospital) => {
    await axios.post(`${API_BASE}/hospitals/add`, hospital);
  },

  updateHospital: async (id, hospital) => {
    await axios.put(`${API_BASE}/hospitals/update/${id}`, hospital);
  },

  deleteHospital: async (id) => {
    await axios.delete(`${API_BASE}/hospitals/delete/${id}`);
  },

  addClinic: async (clinic) => {
    await axios.post(`${API_BASE}/specializations/add`, clinic);
  },

  updateClinic: async (id, clinic) => {
    await axios.put(`${API_BASE}/specializations/update/${id}`, clinic);
  },

  deleteClinic: async (id) => {
    await axios.delete(`${API_BASE}/specializations/delete/${id}`);
  },
};

export default adminService;
