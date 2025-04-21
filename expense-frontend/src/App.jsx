import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthContainer from "./pages/AuthContainer";
import MainLayout from "./layouts/MainLayout"; // ← Güncel layout
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AllExpenses from "./pages/AllExpenses";
import AddCategory from "./pages/AddCategory";
import AllCategories from "./pages/AllCategories";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />

        {/* Layout tabanlı route grubu */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/all-expenses" element={<AllExpenses />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/all-categories" element={<AllCategories />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
