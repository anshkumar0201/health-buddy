import { useState, useEffect } from "react";
import { Activity, Search, Info } from "lucide-react";
import diseasesData from "@/data/diseases.json";

const categories = [
  "All",
  "Cardiovascular",
  "Respiratory",
  "Metabolic",
  "Musculoskeletal",
  "Neurological",
  "Infectious",
  "Mental Health",
  "Digestive",
  "Skin",
  "Eye",
  "Other",
];

export default function SymptomChecker() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    if (Array.isArray(diseasesData)) {
      setDiseases(diseasesData);
    } else {
      console.error("diseases.json must be an array");
    }
  }, []);

  const filteredDiseases = diseases.filter(
    (d) =>
      (activeCategory === "All" || d.category === activeCategory) &&
      d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Symptom Checker
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          Select a condition to start your health assessment
        </p>

        {/* Notice */}
        <div className="mt-8 max-w-3xl mx-auto rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-blue-800 text-sm leading-relaxed">
            <span className="font-semibold block mb-1">Important Notice</span>
            This tool provides general guidance only and is not a substitute for
            professional medical advice. Always consult a healthcare provider
            for accurate diagnosis and treatment.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diseases..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8 bg-gray-100 rounded-xl p-2 grid grid-cols-6 gap-y-3 gap-x-6 text-center cursor-pointer overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer
                ${
                  activeCategory === cat
                    ? "bg-white border border-black shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDiseases.map((d, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl shadow-lg border p-6
    flex flex-col justify-between
    hover:shadow-xl transition cursor-pointer"
            >
              <div>
                <span
                  className="inline-flex items-center
    mb-3 px-3.5 py-1.5
    rounded-2xl
    text-xs font-semibold
    bg-black text-white
    leading-none
    transition
    hover:bg-gray-600"
                >
                  {d.category}
                </span>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {d.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {d.description || "Description coming soon."}
                </p>
              </div>

              <button
                className="mt-6 w-full py-3 rounded-xl font-medium
    flex items-center justify-center gap-2
    bg-black text-white
    transition-all duration-200
    group-hover:bg-blue-800
    group-hover:scale-[1.02]"
              >
                Start Assessment →
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
