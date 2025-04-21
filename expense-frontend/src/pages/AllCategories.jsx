import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7089/api/Categorys/getall")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Kategoriler alınamadı", err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800">Tüm Kategoriler</h1>
      <p className="mt-4 text-gray-600">Oluşturduğun tüm kategorileri burada görebilirsin.</p>

      <ul className="mt-6 space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="p-3 bg-white shadow rounded text-gray-700">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
