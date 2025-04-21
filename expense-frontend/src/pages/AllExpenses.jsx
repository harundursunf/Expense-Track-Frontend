import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token bulunamadı.");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
      return;
    }

    const userId =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7089/api/Expense/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExpenses(res.data);
      } catch (err) {
        console.error("Giderleri çekerken hata:", err);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-800">Tüm Giderler</h1>
      <ul className="mt-4 space-y-2">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="border p-4 rounded shadow flex justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{expense.title}</h2>
              <p className="text-gray-600">{expense.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(expense.expenseDate).toLocaleString()}
              </p>
            </div>
            <div className="text-right font-bold text-green-700">
              ₺{expense.amount.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
