import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import EmergencyBar from "@/components/EmergencyBar"
import HomePage from "@/pages/HomePage" // or Home.jsx
import SymptomAnalyzer from "@/pages/SymptonAnalyzer" // or SymptomAnalyzer.jsx

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
      </Routes>

      <EmergencyBar />
    </BrowserRouter>
  )
}
