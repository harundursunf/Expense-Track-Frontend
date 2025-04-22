import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  LineChart, // Keep LineChart for potential future use, though BarChart is used now
  BarChart, // Import BarChart
  Bar, // Import Bar
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid, // Import CartesianGrid for better readability in BarChart
} from "recharts";

// Slightly enhanced color palette (can be customized further)
const COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];
const BAR_COLOR = "#8884d8"; // Single color for bars, or use COLORS array below

export default function Dashboard() {
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [userName, setUserName] = useState(""); // Optional: Display user name

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      // Extract user ID using common claims
      const userId =
        decoded.sub ||
        decoded.nameid ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      // Optional: Extract user name if available (adjust claim name if different)
      const name = decoded.name || decoded.given_name || "Kullanıcı";
      setUserName(name);

      if (!userId) {
        console.error("User ID not found in token");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // --- Fetch Expense Data ---
      axios
        .get(`https://localhost:7089/api/Expense/user/${userId}`, config)
        .then((res) => {
          const expenses = res.data || []; // Ensure expenses is an array

          // Calculate Total Expense
          const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
          setTotalExpense(total);

          // Calculate Monthly Expenses
          const monthly = {};
          expenses.forEach((e) => {
            try {
              // Ensure expenseDate is valid before processing
              if (e.expenseDate && !isNaN(new Date(e.expenseDate))) {
                const date = new Date(e.expenseDate);
                // Use 'tr-TR' locale for Turkish month names
                const month = date.toLocaleString("tr-TR", { month: "short" });
                const year = date.getFullYear();
                const monthYear = `${month} ${year}`; // Combine month and year
                monthly[monthYear] = (monthly[monthYear] || 0) + (e.amount || 0);
              } else {
                console.warn("Invalid or missing expenseDate:", e);
              }
            } catch (error) {
              console.error("Error processing date:", e.expenseDate, error);
            }
          });

          // Sort monthly data chronologically (optional but recommended)
          const sortedMonthlyData = Object.entries(monthly)
            .map(([monthYear, value]) => {
              // Attempt to parse monthYear back to a date for sorting
              // This relies on the locale format being consistent. A more robust way
              // would be to store year and month number during aggregation.
              const [monthStr, yearStr] = monthYear.split(' ');
              const monthNum = new Date(Date.parse(monthStr +" 1, "+yearStr)).getMonth(); // Simple parse attempt
              return {
                name: monthYear,
                value,
                year: parseInt(yearStr),
                month: monthNum
              };
            })
            .sort((a, b) => {
              if (a.year !== b.year) return a.year - b.year;
              return a.month - b.month;
            });

          setMonthlyExpenses(sortedMonthlyData);

          // --- Fetch Category Data (after expenses are loaded to potentially calculate real distribution) ---
          axios.get("https://localhost:7089/api/Categorys/getall", config)
            .then((catRes) => {
              const categories = catRes.data || []; // Ensure categories is an array
              setCategoryCount(categories.length);

              // --- Calculate REAL Category Distribution ---
              // Note: This assumes your expense objects have a 'categoryId' or similar property
              // and your category objects have an 'id' or 'categoryId' property. Adjust accordingly.
              const distribution = {};
              categories.forEach(cat => {
                // Use categoryName as the key, initialize value to 0
                distribution[cat.categoryName] = { name: cat.categoryName, value: 0 };
              });

              expenses.forEach(exp => {
                // Find the category name for the current expense
                // IMPORTANT: Adjust 'exp.categoryId' and 'cat.id' based on your actual data structure
                const category = categories.find(cat => cat.id === exp.categoryId); // Example matching logic
                if (category && distribution[category.categoryName]) {
                  distribution[category.categoryName].value += (exp.amount || 0);
                }
              });

              // Filter out categories with zero expense if desired
              const finalDistribution = Object.values(distribution); //.filter(d => d.value > 0);

              // If you still want dummy data for testing, uncomment the block below
              /*
              console.warn("Using DUMMY category distribution data!");
              const dummyDistribution = categories.map((c, i) => ({
                name: c.categoryName || `Kategori ${i+1}`, // Handle potential missing names
                value: Math.floor(Math.random() * 500 + 100), // Random value
              }));
              setCategoryDistribution(dummyDistribution);
              */

              // Use the calculated real distribution
              setCategoryDistribution(finalDistribution);


            })
            .catch((err) => console.error("Error fetching categories:", err));

        })
        .catch((err) => console.error("Error fetching expenses:", err));

    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle invalid token case, e.g., redirect to login
      localStorage.removeItem("token");
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    // Changed min-h-screen to h-full and added overflow-hidden
    <div className="h-full bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 md:p-10 space-y-8 overflow-hidden">
      {/* Header */}
      <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Gösterge Paneli</h1>
          <p className="text-gray-600 mt-2">Hoş geldin {userName}! İşte finansal özetin 📊</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Expense */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Toplam Harcama</p>
          <p className="text-3xl font-bold text-red-600">
            {totalExpense.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            {/* Use toLocaleString for better currency formatting */}
          </p>
        </div>

        {/* Card 2: Category Count */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Tanımlı Kategori</p>
          <p className="text-3xl font-bold text-blue-600">{categoryCount}</p>
        </div>

        {/* Add more cards here if needed (e.g., Total Income, Savings Rate) */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200 opacity-50 cursor-not-allowed" title="Yakında">
          <p className="text-sm font-medium text-gray-400 mb-1">Toplam Gelir</p>
          <p className="text-3xl font-bold text-gray-400">--,-- ₺</p>
        </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200 opacity-50 cursor-not-allowed" title="Yakında">
          <p className="text-sm font-medium text-gray-400 mb-1">En Çok Harcanan Ay</p>
          <p className="text-3xl font-bold text-gray-400">--</p>
        </div>
      </div>

      {/* Charts Section */}
      {/* This section's height might cause overflow if its content is too tall */}
      {/* Adding a max-height and overflow-y-auto here could make sense if you want THIS section to scroll internally */}
      {/* but based on your request "kapalı osun", the main div's overflow-hidden will clip it */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Kategori Dağılımı (Harcama Bazlı)</h2>
            {/* Check if data exists before rendering chart */}
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120} // Slightly larger radius
                    fill="#8884d8" // Base fill color
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Improved label
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36}/>
                  <Tooltip formatter={(value) => value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10">Harcama verisi bulunamadı veya kategorilerle eşleşmedi.</p>
            )}
        </div>

        {/* Monthly Expenses Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Aylık Harcama Grafiği</h2>
            {/* Check if data exists before rendering chart */}
            {monthlyExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                {/* Changed to BarChart */}
                <BarChart data={monthlyExpenses} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} /> {/* Add subtle grid lines */}
                    <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} interval={0} fontSize={12} /> {/* Rotate labels if long */}
                    <YAxis tickFormatter={(value) => value.toLocaleString('tr-TR')} fontSize={12} /> {/* Format Y-axis ticks */}
                    <Tooltip formatter={(value) => value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} />
                    <Legend verticalAlign="top" height={36}/>
                    {/* Changed Line to Bar. Added radius for rounded tops. */}
                    <Bar dataKey="value" name="Harcama" fill={BAR_COLOR} radius={[4, 4, 0, 0]} barSize={30}>
                        {/* Optional: Color each bar differently using COLORS array */}
                        {/* {monthlyExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))} */}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10">Aylık harcama verisi bulunamadı.</p>
            )}
        </div>
      </div>
      {/* Potentially add more sections here */}
    </div>
  );
}