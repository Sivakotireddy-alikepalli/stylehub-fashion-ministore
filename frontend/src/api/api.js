import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8001",
});

API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  if (config.url.startsWith("/admin")) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
  }

  return config;
});

export default API;