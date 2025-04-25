import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaPlus,
  FaList,
  FaThLarge,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import logo from "../images/logo.png";

export default function MainLayout() {
  const [username, setUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {

      const decoded = jwtDecode(token);
      const name =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.name ||
        decoded.username ||
        "";
      setUsername(name);
    } catch (err) {
      console.error("JWT çözümlenirken hata:", err);
    }
  }, []);

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded transition duration-200";
  const iconStyle =
    "text-lg group-hover:scale-110 transform transition duration-200";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-8 overflow-y-auto">
        <div className="flex flex-col items-center mb-4">
          <img
            src={logo}
            alt="Gider Takip Logo"
            className="w-20 h-20 drop-shadow-lg rounded-xl mb-2 transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-3xl font-extrabold text-green-700 tracking-wide">
            Gider Takip
          </h1>
        </div>

        {username && (
          <div className="flex items-center justify-center gap-2 text-gray-800 font-semibold text-center mb-4">
            <span>
              Merhaba&nbsp;👋&nbsp;
              <span className="font-bold text-green-800">{username}</span>!
            </span>
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
                className={`${linkBase} group ${location.pathname === "/add-expense"
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
                className={`${linkBase} group ${location.pathname === "/all-expenses"
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
                className={`${linkBase} group ${location.pathname === "/add-category"
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
                className={`${linkBase} group ${location.pathname === "/all-categories"
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
            className={`flex items-center gap-2 text-gray-800 hover:bg-gray-100 px-3 py-2 rounded transition ${location.pathname === "/dashboard" ? "bg-gray-200 font-semibold" : ""
              }`}
          >
            <FaTachometerAlt className="text-xl text-gray-700" />{" "}
            <span>Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 md:p-10 overflow-hidden">
        <Outlet />
      </main>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-white text-red-500 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 hover:text-red-700 transition duration-200"
      >
        <FaSignOutAlt className="text-lg mr-2" /> Çıkış Yap
      </button>
    </div>
  );
}
