import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Foto2 from '../images/Foto2.png'; // Adjust the path and extension if necessary

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [userId, setUserId] = useState(null); // userId state'e taşındı
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token bulunamadı, kullanıcı giriş yapmamış olabilir.");
      setError("Kullanıcı girişi yapılmamış. Lütfen giriş yapınız."); // Daha bilgilendirici hata
      setLoading(false); // Stop loading
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT (Category):", decoded); // kontrol amaçlı

      // userId alanını buradan al — burası projenin token yapısına göre değişebilir
      const userId =
        decoded.sub || // genellikle ASP.NET Core'da bu olur
        decoded.nameid || // bazen nameid
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]; // Identity tabanlı sistemlerde

      if (!userId) {
        console.error("Token'dan userId alınamadı.");
        setError("Kullanıcı bilginiz alınamadı. Token geçerli değil."); // Daha spesifik hata
        setLoading(false); // Stop loading
        return;
      }

      setUserId(userId);
      setLoading(false); // Stop loading after successful user info

    } catch (err) {
      console.error("Token çözümleme hatası (Category):", err);
      setError("Kullanıcı bilginiz doğrulanamadı. Lütfen tekrar giriş yapınız."); // Daha bilgilendirici hata
      setLoading(false); // Stop loading on error
    }
  }, []); // Boş dependency array, component ilk render edildiğinde çalışır

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Kullanıcı bilgisi alınamadı. Lütfen sayfayı yenileyin veya tekrar giriş yapın.");
      return;
    }
    if (!categoryName.trim()) { // Kategori adının boş olup olmadığını kontrol et
         alert("Kategori adı boş olamaz.");
         return;
    }


    const token = localStorage.getItem("token"); // Token'ı submit anında tekrar al (güncel olabilir)
    // Token yoksa, useEffect hata vermeli ve bu kısma gelmemeliydi,
    // ama ekstra kontrol zarar vermez.
    if (!token) {
         alert("Kimlik doğrulama bilgisi bulunamadı. Lütfen giriş yapın.");
         return;
    }


    const categoryDto = {
      categoryName,
      userId, // State'ten alınan userId kullanıldı
    };

    try {
      // Loading state for submission (optional, but good practice)
      // setSubmitting(true); // Örnek: Submit loading state ekleyebilirsiniz

      await axios.post("https://localhost:7089/api/Categorys/add", categoryDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Kategori başarıyla eklendi!");
      setCategoryName(""); // Formu sıfırla
    } catch (err) {
      console.error("Kategori ekleme hatası:", err.response || err);
       // Hata detayını kullanıcıya göster (isteğe bağlı)
      const errorMessage = err.response?.data?.message || err.message || "Bilinmeyen bir hata oluştu.";
      alert(`Kategori eklenirken bir hata oluştu: ${errorMessage}`);
    } finally {
       // setSubmitting(false); // Örnek: Submit loading state bitişi
    }
  };

   // Optional: Show loading or error state for initial data fetch (userId)
  if (loading) {
      return <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 text-gray-800 text-xl font-semibold">Yükleniyor...</div>;
  }

  if (error) {
      return <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 text-red-800 font-bold text-xl p-6 text-center">
                <p className="mb-4">{error}</p>
                {/* İsteğe bağlı: Giriş sayfasına yönlendirme linki */}
                {/* <a href="/login" className="text-blue-800 hover:underline">Giriş Sayfasına Git</a> */}
             </div>;
  }


  return (
    // Main container: full height/screen, centered content, gradient background
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Content Card: centered, max width, background, shadow, rounded corners */}
      {/* Side-by-side layout için flex-row, üst hizalama için md:items-start */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row md:items-start overflow-hidden">

        {/* Image Section: half width on md+, padding */}
        {/* İçindeki resim varsayılan olarak sola/üste hizalanır */}
        <div className="md:w-1/2 p-6 flex items-center justify-center"> {/* Resmi kendi alanında ortalamak için ek flex */}
             <img
                src={Foto2}
                alt="Category Management Illustration" // Alt text for accessibility
                className="max-w-full h-auto rounded-lg shadow-md" // Responsive image styling
            />
        </div>

        {/* Form Section: half width on md+, padding */}
        <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Yeni Kategori Ekle</h1>
            {/* İsteğe bağlı alt başlık */}
            {/* <p className="text-gray-600 mb-6 text-center">Giderlerinizi gruplandırmak için yeni bir kategori tanımlayın.</p> */}


            <form onSubmit={handleSubmit} className="space-y-4 w-full"> {/* Form genişliği tam */}
              <div> {/* Label eklemek için div içine alındı */}
                 <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                 <input
                    id="categoryName" // Label ile eşleşmesi için id eklendi
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Yeni kategori adı girin" // Placeholder güncellendi
                    className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                 />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                // disabled={submitting} // Örnek: Submit loading state'e göre disabled
              >
                {/* {submitting ? 'Ekleniyor...' : 'Kaydet'} // Örnek: Buton metni loading durumuna göre */}
                Kaydet
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}