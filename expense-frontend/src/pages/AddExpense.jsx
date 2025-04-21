import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AddExpense() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    expenseDate: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token bulunamadı, kullanıcı giriş yapmamış olabilir.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded); // kontrol amaçlı

      // userId alanını buradan al — burası projenin token yapısına göre değişebilir
      const userId =
        decoded.sub || // genellikle ASP.NET Core'da bu olur
        decoded.nameid || // bazen nameid
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]; // Identity tabanlı sistemlerde

      if (!userId) {
        console.error("Token'dan userId alınamadı.");
        return;
      }

      setUserId(userId);

      // Kategorileri çek
      axios
        .get("https://localhost:7089/api/Categorys/getall", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setCategories(res.data))
        .catch((err) =>
          console.error("Kategori çekme hatası:", err.response || err)
        );
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Kullanıcı bilgisi alınamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    const token = localStorage.getItem("token");
    const expenseDto = {
      ...form,
      amount: parseFloat(form.amount),
      userId,
    };

    try {
      await axios.post("https://localhost:7089/api/Expense", expenseDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Gider başarıyla eklendi!");
      setForm({
        title: "",
        description: "",
        amount: "",
        expenseDate: "",
        categoryId: "",
      });
    } catch (err) {
      console.error("Gider ekleme hatası:", err.response || err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800">Yeni Gider Ekle</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          name="title"
          placeholder="Başlık"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="amount"
          type="number"
          placeholder="Tutar"
          value={form.amount}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          name="expenseDate"
          type="datetime-local"
          value={form.expenseDate}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Kategori Seç</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
