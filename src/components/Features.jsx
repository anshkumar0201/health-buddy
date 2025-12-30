import { useNavigate } from "react-router-dom"
import {
  Activity,
  BookOpen,
  Shield,
  MapPin,
  AlertCircle,
} from "lucide-react"

const features = [
  {
    title: "Symptom Checker",
    description: "Assess your health with our AI-powered symptom analysis",
    icon: Activity,
    gradient: "from-blue-500 to-cyan-500",
    action: "Start Assessment",
    path: "/symptom-checker",
  },
  {
    title: "Disease Library",
    description: "Learn about diseases, symptoms, and prevention",
    icon: BookOpen,
    gradient: "from-purple-500 to-pink-500",
    action: "Explore",
    path: "/diseases",
  },
  {
    title: "Prevention Tips",
    description: "Get personalized health and wellness guidance",
    icon: Shield,
    gradient: "from-green-500 to-emerald-500",
    action: "View Tips",
    path: "/prevention",
  },
  {
    title: "Find Clinics",
    description: "Locate nearby healthcare facilities instantly",
    icon: MapPin,
    gradient: "from-orange-500 to-red-500",
    action: "Find Now",
    path: "/clinics",
  },
  {
    title: "Emergency Guide",
    description: "Critical first-aid procedures and helplines",
    icon: AlertCircle,
    gradient: "from-red-500 to-rose-500",
    action: "View Guide",
    path: "/emergency",
  },
]

export default function Features() {
  const navigate = useNavigate()

  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Complete Healthcare Suite
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Everything you need for better health management in one place
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={index}
                className="
                  group bg-white rounded-2xl overflow-hidden
                  shadow-lg
                  transform transition-all duration-300 ease-out
                  hover:-translate-y-3 hover:shadow-3xl
                "
              >
                {/* Top gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />

                <div className="p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`
                      w-14 h-14 rounded-2xl mb-6
                      bg-gradient-to-br ${feature.gradient}
                      flex items-center justify-center
                      shadow-md
                      transform transition-transform duration-300 ease-out
                      group-hover:scale-110
                    `}
                  >
                    <Icon className="w-7 h-7 text-white pointer-events-none" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-gray-600 flex-1">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(feature.path)}
                    className="
                      mt-6 w-full
                      bg-blue-600 text-white
                      py-2.5 rounded-lg font-medium
                      transition-all duration-300
                      hover:bg-blue-800
                      active:scale-95
                      cursor-pointer
                      select-none
                    "
                  >
                    {feature.action}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
