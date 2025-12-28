import { CheckCircle } from "lucide-react"
import whychoose from "../assets/whychoose.jpeg"

const points = [
  "Early disease risk detection",
  "Expert-verified information",
  "Privacy-focused design",
  "Multi-language support",
  "Free and accessible to all",
  "Emergency response guidance"
]

export default function WhyChoose() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left content */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary">
            Trusted Healthcare
          </span>

          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose HealthBuddy?
          </h2>

          <p className="mt-6 text-muted max-w-xl">
            We're on a mission to make quality healthcare accessible to everyone,
            especially in rural and underserved regions.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="w-full">
          <div className="rounded-3xl overflow-hidden shadow-soft">
            <img
              src={whychoose}
              alt="Healthcare professional"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
