import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // userId'yi almak için gerekebilir, ancak bu bileşen şu an kullanmıyor gibi. API token gerektiriyorsa eklenmeli. API token gerektiriyorsa aşağıdaki fetchCategories güncellenmeli.

export default function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);


  const fetchCategories = () => {
      axios
        .get("https://localhost:7089/api/Categorys/getall")
        .then((res) => setCategories(res.data))
        .catch((err) => {
            console.error("Kategoriler alınamadı", err);
            setFeedbackMessage({ message: "Kategoriler yüklenirken bir hata oluştu.", type: "error" });
        });
  };

  const handleDeleteClick = (id) => {
    setConfirmAction({ type: 'delete', id: id, message: 'Bu kategoriyi silmek istediğinizden emin misiniz?' });
  };

  const handleConfirmDelete = async () => {
    const idToDelete = confirmAction.id;
    setConfirmAction(null);

    // API token gerektiriyorsa buraya token ekleme mantığı gelmeli
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   setFeedbackMessage({ message: "Silme işlemi için kimlik doğrulama gerekiyor. Lütfen tekrar giriş yapın.", type: "error" });
    //   return;
    // }
    // headers: { Authorization: `Bearer ${token}` }

    try {
      await axios.delete(`https://localhost:7089/api/Categorys/${idToDelete}`);

      setFeedbackMessage({ message: "Kategori başarıyla silindi!", type: "success" });
      setCategories(categories.filter(cat => cat.id !== idToDelete));

    } catch (err) {
      console.error("Silme işlemi başarısız", err);
      const errorMessage = err.response?.data?.message || "Kategori silinirken bir hata oluştu.";
      setFeedbackMessage({ message: errorMessage, type: "error" });
    }
  };

  const handleCancelConfirm = () => {
    setConfirmAction(null);
    setFeedbackMessage({ message: "Silme işlemi iptal edildi.", type: "error" });
  };


  const handleUpdate = async (category) => {
     // API token gerektiriyorsa buraya token ekleme mantığı gelmeli
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   setFeedbackMessage({ message: "Güncelleme için kimlik doğrulama gerekiyor. Lütfen tekrar giriş yapın.", type: "error" });
    //   return;
    // }
    // headers: { Authorization: `Bearer ${token}` }

    const newName = prompt("Yeni kategori adı:", category.categoryName);

    if (newName === null) {
        setFeedbackMessage({ message: "Güncelleme iptal edildi.", type: "error" });
        return; // User clicked Cancel on prompt
    }

    const trimmedName = newName.trim();

    if (trimmedName === "") {
        setFeedbackMessage({ message: "Kategori adı boş bırakılamaz.", type: "error" });
        return;
    }

    try {
        // Assuming userId is needed by the API for update
        const userId = category.userId; // Kategori objesi zaten userId'yi içeriyor olmalı
        if (!userId) {
             // Eğer kategori objesinde userId yoksa ve API bekliyorsa
             const token = localStorage.getItem("token");
             if (token) {
                 try {
                     const decoded = jwtDecode(token);
                     userId = decoded.sub || decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                 } catch (decodeErr) {
                      console.error("Token çözümleme hatası:", decodeErr);
                      setFeedbackMessage({ message: "Kullanıcı bilgisi doğrulanamadı.", type: "error" });
                      return;
                 }
             }
             if (!userId) {
                 setFeedbackMessage({ message: "Kullanıcı bilgisi alınamadı veya kategoriye atanmamış. Güncelleme yapılamaz.", type: "error" });
                 return;
             }
        }


      await axios.put("https://localhost:7089/api/Categorys/update", {
          id: category.id,
          categoryName: trimmedName,
          userId: userId
      });

      setFeedbackMessage({ message: "Kategori başarıyla güncellendi!", type: "success" });

      setCategories(categories.map(cat =>
          cat.id === category.id ? { ...cat, categoryName: trimmedName } : cat
      ));

    } catch (err) {
      console.error("Güncelleme başarısız", err);
      const errorMessage = err.response?.data?.message || "Kategori güncellenirken bir hata oluştu.";
      setFeedbackMessage({ message: errorMessage, type: "error" });
    }
  };

  const handleAddLimit = async (category) => { // category objesini alıyoruz, id ve userId lazım olabilir
    // API token gerektiriyorsa buraya token ekleme mantığı gelmeli
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   setFeedbackMessage({ message: "Limit ekleme için kimlik doğrulama gerekiyor. Lütfen tekrar giriş yapın.", type: "error" });
    //   return;
    // }
    // headers: { Authorization: `Bearer ${token}` }

    const amount = prompt("Limit miktarı girin:");
    if (amount === null) {
        setFeedbackMessage({ message: "Limit ekleme iptal edildi.", type: "error" });
        return;
    }

    const start = prompt("Başlangıç tarihi (yyyy-mm-dd):");
     if (start === null) {
        setFeedbackMessage({ message: "Limit ekleme iptal edildi.", type: "error" });
        return;
    }

    const end = prompt("Bitiş tarihi (yyyy-mm-dd):");
     if (end === null) {
        setFeedbackMessage({ message: "Limit ekleme iptal edildi.", type: "error" });
        return;
    }


    if (!amount || !start || !end) {
      setFeedbackMessage({ message: "Tüm alanları doldurmanız gerekiyor.", type: "error" });
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setFeedbackMessage({ message: "Geçerli bir limit miktarı girin.", type: "error" });
        return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
        setFeedbackMessage({ message: "Geçerli bir tarih formatı girin (yyyy-mm-dd).", type: "error" });
        return;
    }

    if (startDate >= endDate) {
        setFeedbackMessage({ message: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.", type: "error" });
        return;
    }

    // Assuming userId is needed by the API for adding limit
    const userId = category.userId; // Kategori objesi zaten userId'yi içeriyor olmalı
    if (!userId) {
         // Eğer kategori objesinde userId yoksa ve API bekliyorsa
         const token = localStorage.getItem("token");
         if (token) {
             try {
                 const decoded = jwtDecode(token);
                 userId = decoded.sub || decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
             } catch (decodeErr) {
                  console.error("Token çözümleme hatası:", decodeErr);
                  setFeedbackMessage({ message: "Kullanıcı bilgisi doğrulanamadı.", type: "error" });
                  return;
             }
         }
         if (!userId) {
             setFeedbackMessage({ message: "Kullanıcı bilgisi alınamadı veya kategoriye atanmamış. Limit eklenemez.", type: "error" });
             return;
         }
    }


    const dto = {
      categoryId: category.id, // Kategori objesinden id alınır
      limitAmount: parsedAmount,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userId: userId // API bekliyorsa userId eklenir
    };

    try {
        await axios
        .post("https://localhost:7089/api/CategoryLimts/add", dto);

        setFeedbackMessage({ message: "Limit başarıyla eklendi!", type: "success" });
        // İsteğe bağlı: Limitler eklendikten sonra kategorileri veya limitleri yeniden çekebilirsiniz.
        // fetchCategories(); // Eğer kategori listesi limit bilgisini içeriyorsa
    } catch (err) {
        console.error("Limit ekleme başarısız", err);
        const errorMessage = err.response?.data?.message || "Limit eklenirken bir hata oluştu.";
        setFeedbackMessage({ message: errorMessage, type: "error" });
    }
  };


  return (
    <div className="p-6 relative">

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

      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg z-50 text-center">
            <p className="text-gray-800 mb-4">{confirmAction.message}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                Evet, Sil
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}


      <h1 className="text-2xl font-bold text-blue-800 mb-6">Tüm Kategoriler</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {cat.categoryName}
              </h2>
            </div>

            <div className="flex flex-col space-y-3 self-end w-full">
              <button
                onClick={() => handleUpdate(cat)}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors duration-200"
              >
                Güncelle
              </button>
              <button
                onClick={() => handleDeleteClick(cat.id)}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200"
              >
                Sil
              </button>
               {/* Kategoriye Limit Ekle butonu artık kategori objesini gönderiyor */}
              <button
                onClick={() => handleAddLimit(cat)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200"
              >
                Limit Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}