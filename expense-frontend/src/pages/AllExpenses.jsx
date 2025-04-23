  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { jwtDecode } from "jwt-decode"; // jwt-decode doğru import edilmiş

  export default function AllExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true); // Yüklenme durumu için state
    const [error, setError] = useState(null); // Hata durumu için state

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("Token bulunamadı. Kullanıcı giriş yapmamış olabilir.");
        setError("Lütfen giriş yapın."); // Hata mesajını ayarla
        setLoading(false); // Yüklenmeyi durdur
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("Token çözümleme hatası:", err);
        setError("Giriş bilgilerinizde bir hata var. Lütfen tekrar giriş yapın."); // Hata mesajını ayarla
        setLoading(false); // Yüklenmeyi durdur
        return;
      }

      // Claim adını sabitleyin veya bir değişkene atayın
      const nameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
      const userId = decoded[nameIdentifierClaim];

      if (!userId) {
          console.error("UserID token içinde bulunamadı.");
          setError("Kullanıcı kimliği doğrulanamadı.");
          setLoading(false);
          return;
      }


      fetchExpenses(userId, token);
    }, []); // useEffect bağımlılık dizisi boş, component mount edildiğinde bir kere çalışır

    const fetchExpenses = async (userId, token) => {
      setLoading(true); // Veri çekmeye başlarken yüklenmeyi true yap
      setError(null); // Yeni denemede hatayı sıfırla
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
        setLoading(false); // Veri başarıyla çekildi, yüklenmeyi false yap
      } catch (err) {
        console.error("Giderleri çekerken hata:", err);
        setError("Giderler yüklenirken bir hata oluştu."); // Hata mesajını ayarla
        setLoading(false); // Yüklenmeyi durdur
      }
    };

    const handleDelete = async (id) => {
      // Silme işlemini onaylat
      if (!window.confirm("Bu gideri silmek istediğinizden emin misiniz?")) {
          return; // Kullanıcı iptal ettiyse çık
      }

      const token = localStorage.getItem("token");
      if (!token) {
          alert("Silme işlemi için kimlik doğrulama gerekiyor. Lütfen tekrar giriş yapın.");
          return;
      }

      try {
        await axios.delete(`https://localhost:7089/api/Expense/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Gider başarıyla silindi!");
        // Giderleri tekrar çekmek için userId'yi tokenden al
        const decoded = jwtDecode(token);
        const nameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        const userId = decoded[nameIdentifierClaim];
        if (userId) {
          fetchExpenses(userId, token); // Listeyi güncelle
        } else {
            console.error("Token'dan userId alınamadı, liste güncellenemedi.");
            // Alternatif olarak, silinen öğeyi state'ten çıkarabilirsiniz
            setExpenses(expenses.filter(exp => exp.id !== id));
        }

      } catch (err) {
        console.error("Gider silme hatası:", err.response?.data || err.message);
        const errorMessage = err.response?.data?.message || "Gider silinirken bir hata oluştu.";
        alert(errorMessage);
      }
    };

    const handleUpdate = async (expense) => {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Güncelleme işlemi için kimlik doğrulama gerekiyor. Lütfen tekrar giriş yapın.");
          return;
      }

      const newTitle = prompt("Yeni başlık:", expense.title);
      // prompt ile alınan değer stringdir, sayıya çevirmeliyiz
      const newAmountStr = prompt("Yeni tutar:", expense.amount.toString());

      if (newTitle === null || newAmountStr === null) { // Kullanıcı iptal ettiyse
          return;
      }

      const newAmount = parseFloat(newAmountStr);

      // Başlık boş olamaz ve Tutar geçerli bir sayı olmalı
      if (newTitle.trim() === "" || isNaN(newAmount) || newAmount < 0) {
        alert("Geçerli bir başlık ve sıfırdan büyük bir tutar girin.");
        return;
      }

      // Kategori ve diğer alanlar için de güncelleme isterseniz prompt ekleyebilirsiniz
      // Şu an sadece başlık ve tutar güncelleniyor

      try {
          // API'nin beklediği formatta DTO oluşturun
          // expense objesindeki diğer alanları (description, expenseDate, categoryId vb.)
          // eğer API istiyorsa DTO'ya eklemelisiniz.
        const updateDto = {
          id: expense.id, // Güncellenecek giderin ID'si
          title: newTitle.trim(),
          amount: newAmount,
          // Aşağıdaki alanları API'niz istiyorsa ekleyin:
          description: expense.description,
          expenseDate: expense.expenseDate, // Tarihi değiştirmek istemiyorsak mevcut değeri kullan
          categoryId: expense.categoryId, // Kategoriyi değiştirmek istemiyorsak mevcut değeri kullan
          userId: expense.userId // Kullanıcı ID'sini göndermeye gerek olmayabilir ama API istiyorsa ekleyin
        };

        await axios.put(
          `https://localhost:7089/api/Expense/update`, // PUT isteği genellikle ID'yi body'de veya URL'de alır
          updateDto, // Güncelleme DTO'su
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Gider başarıyla güncellendi!");
        // Giderleri tekrar çekmek için userId'yi tokenden al
        const decoded = jwtDecode(token);
        const nameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        const userId = decoded[nameIdentifierClaim];
        if (userId) {
              fetchExpenses(userId, token); // Listeyi güncelle
        } else {
              console.error("Token'dan userId alınamadı, liste güncellenemedi.");
              // Alternatif olarak, güncellenen öğeyi state içinde bulup güncelleyebilirsiniz
              setExpenses(expenses.map(exp => exp.id === expense.id ? {...exp, title: newTitle.trim(), amount: newAmount} : exp));
        }

      } catch (err) {
        console.error("Gider güncelleme hatası:", err.response?.data || err.message);
        const errorMessage = err.response?.data?.message || "Gider güncellenirken bir hata oluştu.";
        alert(errorMessage);
      }
    };

    // Yüklenme veya hata durumunu göster
      if (loading) {
          return <div className="p-6 text-center text-blue-600">Giderler yükleniyor...</div>;
      }

      if (error) {
          return <div className="p-6 text-center text-red-600">Hata: {error}</div>;
      }

      if (expenses.length === 0) {
          return <div className="p-6 text-center text-gray-600">Henüz gider eklenmemiş.</div>;
      }


    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-purple-800 mb-6">Tüm Giderler</h1>

        {/* Use Grid for layout: 1 column on small, 2 on sm, 3 on md, 4 on lg */}
        {/* Add gap-6 for space between cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {expenses.map((expense) => (
            <div // Changed from li to div for simpler grid item handling and styling
              key={expense.id}
              // Enhanced card styling: padding, rounded corners, shadow, hover effect
              // Use flex-col to stack internal content (details, amount, buttons)
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              {/* Expense Details */}
              <div className="mb-4 flex-grow"> {/* mb-4 adds space below, flex-grow makes it take available height */}
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {expense.title}
                </h2>
                {/* Kategori adını göstermek isterseniz: */}
                {/* <p className="text-sm text-gray-500 mt-1">Kategori: {expense.category?.categoryName || 'Belirtilmemiş'}</p> */}
                <p className="text-gray-600 mt-1">{expense.description}</p> {/* mt-1 adds space below title */}
                <p className="text-sm text-gray-500 mt-2"> {/* mt-2 adds space below description */}
                  Tarih: {new Date(expense.expenseDate).toLocaleDateString()} {/* Sadece tarihi göster */}
                  {/* Saati de göstermek için: .toLocaleString() */}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right mb-6"> {/* mb-6 adds space below the amount */}
                <p className="font-bold text-green-700 text-xl"> {/* Increased font size for amount */}
                  ₺{expense.amount.toFixed(2)}
                </p>
              </div>

              {/* Buttons Section */}
              {/* Use flex-col and space-y for stacked buttons */}
              <div className="flex flex-col space-y-2"> {/* space-y-2 adds space between buttons */}
                <button
                  onClick={() => handleUpdate(expense)}
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors duration-200"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }