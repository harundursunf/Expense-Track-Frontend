import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaPlus,
  FaList,
  FaThLarge,
  FaTachometerAlt,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";

export default function MainLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:7089/api/Users/get/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    const userId = "22361be6-5452-4f88-8a62-e446778541d8";
    fetchUser(userId);
  }, []);

  const linkBase = "flex items-center gap-2 px-3 py-2 rounded transition duration-200";
  const iconStyle = "text-lg group-hover:scale-110 transform transition duration-200";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-8 overflow-y-auto">
        <div className="text-2xl font-extrabold text-green-700 text-center mb-2 tracking-wide">
          💰 Gider Takip
        </div>

        {user && (
          <div className="flex items-center justify-center gap-2 text-gray-800 font-semibold text-center mb-4">
            <FaUserCircle className="text-xl text-green-600" />
            <span>Merhaba, <span className="font-bold text-green-800">{user.username}</span>!</span>
          </div>
        )}

        {/* Expenses */}
        <div>
          <div className="flex items-center gap-2 text-green-900 font-bold mb-2 uppercase text-xs tracking-wider">
            <FaThLarge /> <span>Giderler</span>
          </div>
          <ul className="ml-3 flex flex-col gap-1">
            <li>
              <Link
                to="/add-expense"
                className={`${linkBase} group ${
                  location.pathname === "/add-expense"
                    ? "bg-green-100 text-green-900 font-semibold"
                    : "hover:bg-green-50 text-gray-700"
                }`}
              >
                <FaPlus className={iconStyle} /> Yeni Gider Ekle
              </Link>
            </li>
            <li>
              <Link
                to="/all-expenses"
                className={`${linkBase} group ${
                  location.pathname === "/all-expenses"
                    ? "bg-green-100 text-green-900 font-semibold"
                    : "hover:bg-green-50 text-gray-700"
                }`}
              >
                <FaList className={iconStyle} /> Gider Listesi
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 text-blue-900 font-bold mb-2 uppercase text-xs tracking-wider">
            <FaThLarge /> <span>Kategoriler</span>
          </div>
          <ul className="ml-3 flex flex-col gap-1">
            <li>
              <Link
                to="/add-category"
                className={`${linkBase} group ${
                  location.pathname === "/add-category"
                    ? "bg-blue-100 text-blue-900 font-semibold"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <FaPlus className={iconStyle} /> Yeni Kategori Ekle
              </Link>
            </li>
            <li>
              <Link
                to="/all-categories"
                className={`${linkBase} group ${
                  location.pathname === "/all-categories"
                    ? "bg-blue-100 text-blue-900 font-semibold"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <FaList className={iconStyle} /> Kategori Listesi
              </Link>
            </li>
          </ul>
        </div>

        {/* Dashboard Link */}
        <div className="pt-4 border-t border-gray-200 mt-auto">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 text-gray-800 hover:bg-gray-100 px-3 py-2 rounded transition ${
              location.pathname === "/dashboard" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            <FaTachometerAlt className="text-xl text-gray-700" /> <span>Genel Bakış</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 md:p-10 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
