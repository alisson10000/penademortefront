import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home/HomePage.jsx"
import Login from "../pages/Auth/Login.jsx"
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx"
import AdminAdsPage from "../pages/ads/AdminAdsPage.jsx"
import ResetConfirm from "../pages/Auth/ResetConfirm.jsx"


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Backend emails usam ESTA */}
      <Route path="/reset-password" element={<ResetConfirm />} />
      
      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/ads" element={<AdminAdsPage />} />
    </Routes>
  )
}
