import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
      setError("Giriş bilgilerinizde bir hata var. Lütfen tekrar giriş yapın.");
      setLoading(false);
      return;
    }

    const nameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    const userId = decoded[nameIdentifierClaim];

    if (!userId) {
      console.error("UserID token içinde bulunamadı.");
      setError("Kullanıcı kimliği doğrulanamadı.");
      setLoading(false);
      return;
    }

    fetchExpenses(userId, token);
  }, []);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const fetchExpenses = async (userId, token) => {
    setLoading(true);
    setError(null);
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
      setLoading(false);
    } catch (err) {
      console.error("Giderleri çekerken hata:", err);
      setError("Giderler yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };

  const groupExpensesByMonth = (expenses) => {
    const grouped = expenses.reduce((acc, expense) => {
      const monthYear = new Date(expense.expenseDate).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(expense);
      return acc;
    }, {});
    return grouped;
  };

  const handleDeleteClick = (id) => {
    setConfirmAction({ type: 'delete', id: id, message: 'Bu gideri silmek istediğinizden emin misiniz?' });
  };

  const handleConfirmDelete = async () => {
    const idToDelete = confirmAction.id;
    setConfirmAction(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setFeedbackMessage({ message: "Silme işlemi için kimlik doğrulama gerekiyor. Lütfen tekrar giriş yapın.", type: "error" });
      return;
    }

    try {
      await axios.delete(`https://localhost:7089/api/Expense/${idToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeedbackMessage({ message: "Gider başarıyla silindi!", type: "success" });

      setExpenses(prev => prev.filter(exp => exp.id !== idToDelete));

    } catch (err) {
      console.error("Gider silme hatası:", err);
      const errorMessage = err.response?.data?.message || "Gider silinirken bir hata oluştu.";
      setFeedbackMessage({ message: errorMessage, type: "error" });
    }
  };

  const handleCancelConfirm = () => {
    setConfirmAction(null);
    setFeedbackMessage({ message: "Silme işlemi iptal edildi.", type: "error" });
  };


  const handleUpdate = async (expense) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFeedbackMessage({ message: "Güncelleme için lütfen tekrar giriş yapın.", type: "error" });
      return;
    }

    const newTitle = prompt("Yeni başlık:", expense.title);
    const newAmountStr = prompt("Yeni tutar:", expense.amount.toString());

    if (newTitle === null || newAmountStr === null) {
        setFeedbackMessage({ message: "Güncelleme iptal edildi.", type: "error" });
        return;
    }

    const newAmount = parseFloat(newAmountStr);
    if (newTitle.trim() === "" || isNaN(newAmount) || newAmount < 0) {
      setFeedbackMessage({ message: "Geçerli bir başlık ve sıfırdan büyük bir tutar girin.", type: "error" });
      return;
    }

    try {
      const updateDto = {
        Id: expense.id,
        Title: newTitle.trim(),
        Description: expense.description,
        Amount: newAmount,
        ExpenseDate: expense.expenseDate,
        CategoryId: expense.categoryId,
        UserId: expense.userId
      };

      await axios.put(
        `https://localhost:7089/api/Expense/${expense.id}`,
        updateDto,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbackMessage({ message: "Gider başarıyla güncellendi!", type: "success" });

      setExpenses(prev =>
        prev.map(exp =>
          exp.id === expense.id
            ? { ...exp, title: newTitle.trim(), amount: newAmount }
            : exp
        )
      );

    } catch (err) {
      console.error("Gider güncelleme hatası:", err);
      const msg = err.response?.data?.message || "Gider güncellenirken bir hata oluştu.";
      setFeedbackMessage({ message: msg, type: "error" });
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-blue-600">Giderler yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Hata: {error}</div>;
  }

  if (expenses.length === 0) {
    return <div className="p-6 text-center text-gray-600">Henüz gider eklenmemiş.</div>;
  }

  const groupedExpenses = groupExpensesByMonth(expenses);

  return (
    <div className="p-6 overflow-y-scroll max-h-screen relative">

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


      <h1 className="text-2xl font-bold text-purple-800 mb-6">Tüm Giderler</h1>

      {Object.keys(groupedExpenses).map((month) => (
        <div key={month}>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">{month}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {groupedExpenses[month].map((expense) => (
              <div
                key={expense.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4 flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {expense.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{expense.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Tarih: {new Date(expense.expenseDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right mb-6">
                  <p className="font-bold text-green-700 text-xl">
                    ₺{expense.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleUpdate(expense)}
                    className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors duration-200"
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={() => handleDeleteClick(expense.id)}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}