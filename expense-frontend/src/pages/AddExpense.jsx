  import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Foto1 from '../images/Foto1.jpg'; // Adjust the path and extension if necessary

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
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token bulunamadı, kullanıcı giriş yapmamış olabilir.");
      setError("Kullanıcı girişi yapılmamış."); // Set error state
      setLoading(false); // Stop loading
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
        setError("Kullanıcı bilgisi alınamadı."); // Set error state
        setLoading(false); // Stop loading
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
        .then((res) => {
          setCategories(res.data);
          setLoading(false); // Stop loading after successful fetch
        })
        .catch((err) => {
          console.error("Kategori çekme hatası:", err.response || err);
          setError("Kategoriler yüklenirken bir hata oluştu."); // Set error state
          setLoading(false); // Stop loading on error
        });
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
      setError("Kullanıcı bilgisi doğrulanamadı."); // Set error state
      setLoading(false); // Stop loading on error
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
      // Reset form
      setForm({
        title: "",
        description: "",
        amount: "",
        expenseDate: "",
        categoryId: "",
      });
    } catch (err) {
      console.error("Gider ekleme hatası:", err.response || err);
      alert("Gider eklenirken bir hata oluştu."); // User feedback on submission error
    }
  };

  // Optional: Show loading or error state
  if (loading) {
      return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">Yükleniyor...</div>;
  }

  if (error) {
      return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 text-red-800 font-bold text-xl">{error}</div>;
  }


  return (
    // Main container: full height/screen, centered content, gradient background
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Content Card: centered, max width, background, shadow, rounded corners */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">

        {/* Image Section: half width on md+, centered content */}
        <div className="md:w-1/2 flex items-center justify-center p-4">
            <img
                src={Foto1}
                alt="Expense Management Illustration" // Alt text for accessibility
                className="max-w-full h-auto rounded-lg shadow-md" // Responsive image styling
            />
        </div>

        {/* Form Section: half width on md+, padding */}
        <div className="md:w-1/2 p-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Yeni Gider Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                        id="title"
                        name="title"
                        placeholder="Gider Başlığı"
                        value={form.title}
                        onChange={handleChange}
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <input
                        id="description"
                        name="description"
                        placeholder="Gider Açıklaması"
                        value={form.description}
                        onChange={handleChange}
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Tutar</label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={form.amount}
                        onChange={handleChange}
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        step="0.01" // Allow decimal values
                    />
                </div>
                <div>
                    <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                    <input
                        id="expenseDate"
                        name="expenseDate"
                        type="datetime-local"
                        value={form.expenseDate}
                        onChange={handleChange}
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Kategori Seçiniz</option> {/* Improved placeholder */}
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 font-semibold transition"
                    >
                        Gideri Kaydet
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}