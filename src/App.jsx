import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import EmergencyBar from "@/components/EmergencyBar"
import HomePage from "@/pages/HomePage" // or Home.jsx

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* other routes will go here */}
      </Routes>

      <EmergencyBar />
    </BrowserRouter>
  )
}
