import { Routes, Route } from "react-router-dom"
import Home from "../pages/home/home.jsx"
import Login from "../pages/Auth/Login.jsx"
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}