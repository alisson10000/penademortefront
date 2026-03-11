import { Routes, Route } from "react-router-dom"
import Home from "../pages/home/home.jsx"
import Login from "../pages/Auth/Login.jsx"
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx"
import ResetConfirm from "../pages/Auth/ResetConfirm.jsx" // ✅ CORRETO

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Backend emails usam ESTA */}
      <Route path="/reset-password" element={<ResetConfirm />} />
      
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}
