import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Foto3 from '../images/Foto3.webp'; // Adjust the path and extension if necessary

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Başarı veya hata mesajını tutacak yeni state
  const [feedbackMessage, setFeedbackMessage] = useState(null); // { message: '...', type: 'success' | 'error' } veya null


  // Token çözümleme, userId alma ve kategorileri çekme effect'i (mevcut)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token bulunamadı, kullanıcı giriş yapmamış olabilir.");
      setError("Kullanıcı girişi yapılmamış.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);

      const userId =
        decoded.sub ||
        decoded.nameid ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      if (!userId) {
        console.error("Token'dan userId alınamadı.");
        setError("Kullanıcı bilgisi alınamadı.");
        setLoading(false);
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
          // Kategoriler geldiğinde veya hata oluştuğunda loading'i durdur
          setCategories(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Kategori çekme hatası:", err.response || err);
          setError("Kategoriler yüklenirken bir hata oluştu.");
          // Kategori yükleme hatası olsa bile formun yüklenmesi için loading'i durdur (opsiyonel)
          // Eğer kategoriler olmadan form kullanılamıyorsa, burada sadece error state'i set edip loading'i durdurmak yeterli.
          setLoading(false);
        });
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
      setError("Kullanıcı bilgisi doğrulanamadı.");
      setLoading(false);
    }
  }, []);

  // Geri bildirim mesajını (başarı/hata) belirli bir süre sonra gizlemek için effect
  useEffect(() => {
    if (feedbackMessage) { // Eğer bir mesaj varsa
      // Süreyi 2 saniyeye ayarladık
      const timer = setTimeout(() => {
        setFeedbackMessage(null); // Mesajı 2 saniye sonra gizle
      }, 2000); // 2000 milisaniye = 2 saniye

      // Component unmount olduğunda veya feedbackMessage değiştiğinde timer'ı temizle
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]); // feedbackMessage state'i değiştiğinde bu effect'i yeniden çalıştır


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Önceki mesajı temizle
    setFeedbackMessage(null);


    if (!userId) {
       // Kritik eksik bilgi için şimdilik alert kalsın veya bunu da feedbackMessage'e dönüştürebilirsiniz.
      alert("Kullanıcı bilgisi alınamadı. Lütfen tekrar giriş yapın.");
      return;
    }

     // Basit form validasyonu (Alanların boş olup olmadığını kontrol et)
     const requiredFields = ['title', 'amount', 'expenseDate', 'categoryId'];
     for (const field of requiredFields) {
         if (!form[field] || (typeof form[field] === 'string' && !form[field].trim())) {
             // Hata durumunda feedbackMessage state'ini güncelle
             setFeedbackMessage({ message: `Lütfen tüm alanları doldurunuz. (${field})`, type: "error" });
             return; // Formu göndermeyi durdur
         }
     }
     if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
         setFeedbackMessage({ message: "Lütfen geçerli bir tutar giriniz.", type: "error" });
         return;
     }


    const token = localStorage.getItem("token");
    if (!token) {
       // Kimlik doğrulama eksikliği için şimdilik alert kalsın veya feedbackMessage'e dönüştürün.
       alert("Kimlik doğrulama bilgisi bulunamadı. Lütfen giriş yapın.");
       return;
    }


    const expenseDto = {
      ...form,
      amount: parseFloat(form.amount),
      userId, // userId state'ten geldi
    };

    try {
      await axios.post("https://localhost:7089/api/Expense", expenseDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Başarılı olduğunda feedbackMessage state'ini güncelle (type success)
      setFeedbackMessage({ message: "Gider başarıyla eklendi!", type: "success" });

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
      // Hata durumunda feedbackMessage state'ini güncelle (type error)
      const errorMessage = err.response?.data?.message || err.message || "Bilinmeyen bir hata oluştu.";
      setFeedbackMessage({ message: `Gider eklenirken bir hata oluştu: ${errorMessage}`, type: "error" });
    }
  };

  // Yüklenme ve Hata durumları (mevcut)
  if (loading) {
      return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 text-gray-800 text-xl font-semibold">Yükleniyor...</div>;
  }

  if (error) {
      return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 text-red-800 font-bold text-xl">{error}</div>;
  }

  // Ana render kısmı
  return (
    // Feedback mesajını ana div'in içine fixed olarak konumlandırıyoruz.
    // relative ekleyerek fixed position'ın bu div'e göre olmasını sağlayabiliriz
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative">

      {/* Geri Bildirim Mesajı Alanı - Fixed Position */}
      {feedbackMessage && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50
                     px-6 py-3 rounded-lg shadow-xl text-white text-center
                     ${feedbackMessage.type === 'success'
                       ? 'bg-green-500' // Başarı için daha belirgin yeşil
                       : 'bg-red-500' // Hata için daha belirgin kırmızı
                     }`}
          role="alert"
        >
           {/* İkonlar */}
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


      {/* Content Card: centered, max width, background, shadow, rounded corners */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden z-10"> {/* z-index ekleyerek içeriğin mesajın altında kalmasını sağla */}

        {/* Image Section: half width on md+, centered content */}
        <div className="md:w-1/2 flex items-center justify-center p-4">
            <img
                src={Foto3}
                alt="Expense Management Illustration" // Alt text for accessibility
                className="max-w-full h-auto rounded-lg " // Responsive image styling
            />
        </div>

        {/* Form Section: half width on md+, padding */}
        <div className="md:w-1/2 p-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Yeni Gider Ekle</h1>

            {/* Message box was here, moved to fixed position */}

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
                        placeholder="Gider Açıklaması (İsteğe bağlı)" // Açıklama isteğe bağlı olabilir
                        value={form.description}
                        onChange={handleChange}
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        // Açıklama alanı artık required değil
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
                        min="0.01" // Prevent negative or zero amount
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