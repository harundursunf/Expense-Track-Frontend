// src/services/expenseService.js
import axios from "axios";

const API_URL = "https://localhost:7089/api/Expense";

export const getAllExpenses = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const addExpense = async (expense) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, expense, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};
