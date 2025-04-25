
import axios from "axios";

const API_URL = "https://localhost:7089/api/Auths";


export const login = async (data) => {
  const res = await axios.post(`${API_URL}/Login`, data);
  return res.data;
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/Register`, data);
  return res.data;
};
