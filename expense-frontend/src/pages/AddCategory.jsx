import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    const categoryDto = {
      categoryName,
      userId,
    };

    try {
      await axios.post("https://localhost:7089/api/Categorys/add", categoryDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Kategori eklendi!");
      setCategoryName("");
    } catch (err) {
      console.error("Kategori ekleme hatası:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800">Yeni Kategori Ekle</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Kategori adı"
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
