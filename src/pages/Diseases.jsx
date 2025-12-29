import { useState, useMemo } from "react";
import { BookOpen, Search } from "lucide-react";
import diseasesHub from "@/data/diseases1.json";

const categories = [
  "All Diseases",
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

if (!Array.isArray(diseasesHub)) {
  throw new Error("diseases_hub.json must export an array");
}


export default function Diseases() {
  const [activeCategory, setActiveCategory] = useState("All Diseases");
  const [search, setSearch] = useState("");

  /* ---------------- Category counts ---------------- */
  const categoryCounts = useMemo(() => {
    const counts = {};
    diseasesHub.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, []);

  /* ---------------- Filtering ---------------- */
  const filteredDiseases = diseasesHub.filter((d) => {
    const matchesCategory =
      activeCategory === "All Diseases" || d.category === activeCategory;

    const matchesSearch = d.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Disease Information Hub
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          Learn about common diseases, their symptoms, causes, and prevention
        </p>

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
        <div className="mt-8 bg-gray-100 rounded-xl p-2 grid grid-cols-6 gap-y-3 gap-x-6 text-center overflow-x-auto">
          {categories.map((cat) => {
            const count =
              cat === "All Diseases"
                ? diseasesHub.length
                : categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition
                  flex items-center justify-center gap-2
                  ${
                    activeCategory === cat
                      ? "bg-white border border-black shadow-sm"
                      : "text-gray-600 hover:bg-white"
                  }
                `}
              >
                <span>{cat}</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Disease Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDiseases.map((d, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl shadow-lg border p-6
              hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                {/* Category */}
                <span className="inline-block mb-3 px-3 py-1 rounded-xl text-xs font-semibold bg-black text-white">
                  {d.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {d.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {d.description}
                </p>

                {/* Symptoms */}
                {d.symptoms?.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Common Symptoms:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {d.symptoms.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-700"
                        >
                          {s}
                        </span>
                      ))}

                      {d.symptoms.length > 3 && (
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-200 text-gray-700">
                          +{d.symptoms.length - 3} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Learn more */}
              <button
                className="mt-6 flex items-center justify-between text-sm font-medium text-gray-900
                group-hover:text-blue-600 transition"
              >
                Learn More
                <span className="text-lg">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
