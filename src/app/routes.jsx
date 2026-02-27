import { Routes, Route } from "react-router-dom"
import Home from "../pages/home/home.jsx"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}