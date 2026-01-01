import axios from "axios";

const API = axios.create({
  baseURL: "https://tradly-backend.onrender.com/api/v1/admin",
  withCredentials: true
});

// Automatically add token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;