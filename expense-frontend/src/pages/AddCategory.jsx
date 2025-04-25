import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Foto2 from '../images/logo4.jpg';

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Kullanıcı girişi yapılmamış. Lütfen giriş yapınız.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const userId =
        decoded.sub ||
        decoded.nameid ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      if (!userId) {
        setError("Kullanıcı bilginiz alınamadı. Token geçerli değil.");
        setLoading(false);
        return;
      }

      setUserId(userId);
      setLoading(false);

    } catch (err) {
      console.error("Token çözümleme hatası (Category):", err);
      setError("Kullanıcı bilginiz doğrulanamadı. Lütfen tekrar giriş yapınız.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFeedbackMessage(null);

    if (!userId) {
      setFeedbackMessage({ message: "Kullanıcı bilgisi alınamadı. Lütfen sayfayı yenileyin veya tekrar giriş yapın.", type: "error" });
      return;
    }
    if (!categoryName.trim()) {
      setFeedbackMessage({ message: "Kategori adı boş olamaz.", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setFeedbackMessage({ message: "Kimlik doğrulama bilgisi bulunamadı. Lütfen giriş yapın.", type: "error" });
      return;
    }

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

      setFeedbackMessage({ message: "Kategori başarıyla eklendi!", type: "success" });
      setCategoryName("");

    } catch (err) {
      console.error("Kategori ekleme hatası:", err.response || err);
      const errorMessage = err.response?.data?.message || err.message || "Bilinmeyen bir hata oluştu.";
      setFeedbackMessage({ message: `Kategori eklenirken bir hata oluştu: ${errorMessage}`, type: "error" });
    }
  };

  if (loading) {
      return <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 text-gray-800 text-xl font-semibold">Yükleniyor...</div>;
  }

  if (error) {
      return <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 text-red-800 font-bold text-xl p-6 text-center">
                 <p className="mb-4">{error}</p>
               </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative">

      {feedbackMessage && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50
                     px-6 py-3 rounded-lg shadow-xl text-white text-center
                     ${feedbackMessage.type === 'success'
                       ? 'bg-green-500'
                       : 'bg-red-500'
                     }`}
          role="alert"
        >
           {feedbackMessage.type === 'success' && (
             <svg className="inline-block w-5 h-5 mr-2 -mt-1" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
           )}
            {feedbackMessage.type === 'error' && (
                <svg className="inline-block w-5 h-5 mr-2 -mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
          <span className="font-semibold">{feedbackMessage.message}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row md:items-start overflow-hidden z-10">

        <div className="md:w-1/2 p-7 flex items-center justify-center ">
             <img
               src={Foto2}
               alt="Category Management Illustration"
               className="max-w-full h-auto rounded-lg shadow-md "
           />
        </div>

        <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center mt-[50px]">Yeni Kategori Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                 <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                 <input
                    id="categoryName"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Yeni kategori adı girin"
                    className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                 />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Kaydet
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}