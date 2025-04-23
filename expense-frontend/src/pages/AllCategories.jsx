import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
      axios
        .get("https://localhost:7089/api/Categorys/getall")
        .then((res) => setCategories(res.data))
        .catch((err) => console.error("Kategoriler alınamadı", err));
  };

  const handleDelete = (id) => {
    // Confirm before deleting
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      axios
        .delete(`https://localhost:7089/api/Categorys/${id}`)
        .then(() => {
          alert("Kategori başarıyla silindi!");
          fetchCategories(); // Refresh the list after deletion
        })
        .catch((err) => {
          console.error("Silme işlemi başarısız", err);
          alert("Kategori silinirken bir hata oluştu.");
        });
    }
  };

  const handleUpdate = (category) => {
    const newName = prompt("Yeni kategori adı:", category.categoryName);
    if (newName && newName.trim() !== "") {
      // Optionally trim whitespace
      const trimmedName = newName.trim();
      axios
        .put("https://localhost:7089/api/Categorys/update", {
          id: category.id, // Ensure ID is included for update
          categoryName: trimmedName,
          userId: category.userId // Bunu ekle!
        })
        .then(() => {
          alert("Kategori başarıyla güncellendi!");
          fetchCategories(); // Refresh the list after update
        })
        .catch((err) => {
          console.error("Güncelleme başarısız", err);
          alert("Kategori güncellenirken bir hata oluştu.");
        });
    } else if (newName !== null) { // If user clicked OK but left blank
        alert("Kategori adı boş bırakılamaz.");
    }
    // If newName is null, user clicked Cancel, do nothing.
  };

  const handleAddLimit = (categoryId) => {
    const amount = prompt("Limit miktarı girin:");
    const start = prompt("Başlangıç tarihi (yyyy-mm-dd):");
    const end = prompt("Bitiş tarihi (yyyy-mm-dd):");

    if (!amount || !start || !end) {
      alert("Tüm alanları doldurmanız gerekiyor.");
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Geçerli bir limit miktarı girin.");
        return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
        alert("Geçerli bir tarih formatı girin (yyyy-mm-dd).");
        return;
    }

    // Optional: Basic check if end date is after start date
    if (startDate >= endDate) {
        alert("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");
        return;
    }


    const dto = {
      categoryId: categoryId,
      limitAmount: parsedAmount,
      startDate: startDate.toISOString(), // Send dates in ISO format
      endDate: endDate.toISOString(),     // Send dates in ISO format
    };

    axios
      .post("https://localhost:7089/api/CategoryLimts/add", dto)
      .then(() => {
        alert("Limit başarıyla eklendi!");
        // Optionally refetch categories or limits if needed elsewhere
      })
      .catch((err) => {
        console.error("Limit ekleme başarısız", err);
        // More specific error message if API provides one
        const errorMessage = err.response?.data?.message || "Limit eklenirken bir hata oluştu.";
        alert(errorMessage);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Tüm Kategoriler</h1>
      {/* Use Grid for layout: 1 column on small, 2 on sm, 3 on md, 4 on lg */}
      {/* Add gap-6 for more spacing between cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <div // Changed from li to div for simpler grid item handling
            key={cat.id}
            // Enhanced card styling: slightly larger padding, rounded corners, shadow
            // Use flex-col to stack internal content (name and buttons)
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            {/* Category Name */}
            <div className="mb-4"> {/* Added bottom margin */}
              <h2 className="text-xl font-semibold text-gray-800 truncate"> {/* truncate prevents long names from overflowing */}
                {cat.categoryName}
              </h2>
            </div>

            {/* Buttons Section */}
            {/* Use flex-col and space-y for stacked buttons, align them to the right */}
            <div className="flex flex-col space-y-3 self-end w-full"> {/* self-end pushes buttons to bottom right */}
              <button
                onClick={() => handleUpdate(cat)}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors duration-200"
              >
                Güncelle
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200"
              >
                Sil
              </button>
              <button
                onClick={() => handleAddLimit(cat.id)}
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