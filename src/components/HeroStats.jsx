import {
  BookOpen,
  Shield,
  Users,
  AlertCircle,
} from "lucide-react"

const stats = [
  {
    icon: BookOpen,
    value: "50+",
    label: "Diseases Covered",
  },
  {
    icon: Shield,
    value: "200+",
    label: "Health Tips",
  },
  {
    icon: Users,
    value: "10+",
    label: "Languages",
  },
  {
    icon: AlertCircle,
    value: "10+",
    label: "Emergency Guides",
  },
]

export default function HeroStats() {
  return (
    <section className="relative z-20 -mt-14 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg px-6 py-8 text-center hover:shadow-2xl transition-shadow"
              >
                <Icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
