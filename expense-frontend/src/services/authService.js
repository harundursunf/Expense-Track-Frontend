// src/services/authService.js
import axios from "axios";

const API_URL = "https://localhost:5001/api/Auth";

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/Login`, data);
  return res.data;
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/Register`, data);
  return res.data;
};
