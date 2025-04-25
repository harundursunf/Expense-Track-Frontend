import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

const COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];
const BAR_COLOR = "#8884d8";

export default function Dashboard() {
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [maxMonth, setMaxMonth] = useState({ name: "--", value: 0 });
  const [userName, setUserName] = useState("");   // ← boş başlayacak

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      // ID ve ad claim’lerini yakala
      const userId =
        decoded.sub ||
        decoded.nameid ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const name =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.given_name ||
        decoded.name ||
        decoded.username ||
        "";
      setUserName(name);                         // ← selamlamada göstereceğiz

      if (!userId) return console.error("User ID not found in token");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      /* … mevcut axios istekleri ve veriyi işleme kodun değişmeden kalıyor … */
      axios
        .get(`https://localhost:7089/api/Expense/user/${userId}`, config)
        .then((res) => {
          const expenses = res.data || [];

          /* === toplam, aylık, en yüksek ay hesaplamaları === */
          const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
          setTotalExpense(total);

          const monthly = {};
          expenses.forEach((e) => {
            if (e.expenseDate && !isNaN(new Date(e.expenseDate))) {
              const date = new Date(e.expenseDate);
              const month = date.toLocaleString("tr-TR", { month: "short" });
              const year = date.getFullYear();
              const key = `${month} ${year}`;
              monthly[key] = (monthly[key] || 0) + (e.amount || 0);
            }
          });

          const sortedMonthlyData = Object.entries(monthly)
            .map(([name, value]) => {
              const [mStr, yStr] = name.split(" ");
              const monthNum = new Date(Date.parse(`${mStr} 1, ${yStr}`)).getMonth();
              return { name, value, year: +yStr, month: monthNum };
            })
            .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));

          setMonthlyExpenses(sortedMonthlyData);

          if (sortedMonthlyData.length) {
            const top = sortedMonthlyData.reduce((a, b) => (a.value > b.value ? a : b));
            setMaxMonth(top);
          }

          // Kategori dağılımı
          axios
            .get("https://localhost:7089/api/Categorys/getall", config)
            .then((catRes) => {
              const categories = catRes.data || [];
              setCategoryCount(categories.length);

              const distribution = {};
              categories.forEach((c) => {
                distribution[c.categoryName] = { name: c.categoryName, value: 0 };
              });

              expenses.forEach((exp) => {
                const cat = categories.find((c) => c.id === exp.categoryId);
                if (cat) distribution[cat.categoryName].value += exp.amount || 0;
              });

              setCategoryDistribution(Object.values(distribution));
            })
            .catch((err) => console.error("Error fetching categories:", err));
        })
        .catch((err) => console.error("Error fetching expenses:", err));
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 md:p-10 space-y-8 overflow-hidden">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Gösterge Paneli</h1>
        {userName && (
          <p className="text-gray-600 mt-2">
            Hoş geldin&nbsp;{userName}! Finansal özetin hazır 📊
          </p>
        )}
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Harcama */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Toplam Harcama</p>
          <p className="text-3xl font-bold text-red-600">
            {totalExpense.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
          </p>
        </div>

        {/* Kategori Sayısı */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Tanımlı Kategori</p>
          <p className="text-3xl font-bold text-blue-600">{categoryCount}</p>
        </div>

        {/* En Çok Harcanan Ay */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">En Çok Harcanan Ay</p>
          <p className="text-lg font-semibold text-gray-700">{maxMonth.name}</p>
          <p className="text-3xl font-bold text-purple-600">
            {maxMonth.value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
          </p>
        </div>

        {/* Placeholder Kart (Gelecek Özellik) */}
        <div className="bg-white p-6 rounded-xl shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200 opacity-50 cursor-not-allowed" title="Yakında">
          <p className="text-sm font-medium text-gray-400 mb-1">Toplam Gelir</p>
          <p className="text-3xl font-bold text-gray-400">--,-- ₺</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Kategori Dağılımı (Harcama Bazlı)</h2>
          {categoryDistribution.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip formatter={(v) => v.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-10">Harcama verisi bulunamadı veya kategorilerle eşleşmedi.</p>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Aylık Harcama Grafiği</h2>
          {monthlyExpenses.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyExpenses} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} fontSize={12} interval={0} />
                <YAxis tickFormatter={(v) => v.toLocaleString("tr-TR")} fontSize={12} />
                <Tooltip formatter={(v) => v.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="value" name="Harcama" fill={BAR_COLOR} radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-10">Aylık harcama verisi bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}
