import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Payment from "./pages/Payment";

function App() {
  const token = localStorage.getItem("token");

  return (
    <div className="app-shell">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Redirect logged-in users away from login */}
          <Route
            path="/login"
            element={token ? <Navigate to="/admin" replace /> : <Login />}
          />
          <Route
            path="/payment"
            element={token ? <Payment /> : <Navigate to="/login" replace />}
          />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/register"
            element={token ? <Navigate to="/admin" replace /> : <Register />}
          />

          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />

          {/* 🔐 Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
