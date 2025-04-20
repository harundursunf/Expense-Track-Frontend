import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthContainer from "./pages/AuthContainer"; // Adjust the path
// Import other components like Dashboard if needed
// import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Both / and /register should render the AuthContainer */}
        <Route path="/" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />

        {/* Add other routes */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Add protected routes */}
      </Routes>
    </Router>
  );
}

export default App;