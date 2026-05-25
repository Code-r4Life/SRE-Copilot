import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
// });

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


// ==============================
// MONITORING
// ==============================

export const startMonitoring = async (payload) => {
  const response = await api.post("/api/monitor", payload);
  return response.data;
};

export const stopMonitoring = async (apiId) => {
  const response = await api.post(`/api/stop/${apiId}`);
  return response.data;
};


// ==============================
// DASHBOARD
// ==============================

export const fetchDashboardStats = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};

export const fetchApis = async () => {
  const response = await api.get("/api/apis");
  return response.data;
};

export const fetchIncidents = async () => {
  const response = await api.get("/api/incidents");
  return response.data;
};

export const fetchAnomalies = async () => {
  const response = await api.get("/api/anomalies");
  return response.data;
};


// ==============================
// RCA
// ==============================

export const fetchRCA = async (incidentId) => {
  const response = await api.get(`/api/rca/${incidentId}`);
  return response.data;
};


export default api;