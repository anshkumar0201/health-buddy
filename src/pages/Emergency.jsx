import {
  AlertCircle,
  Phone,
  Zap,
  Droplet,
  Flame,
  HeartPulse,
  Brain,
  Wind,
} from "lucide-react";

const helplines = [
  { number: "108", label: "Ambulance" },
  { number: "104", label: "Health Helpline" },
  { number: "102", label: "Medical Emergency" },
  { number: "112", label: "National Emergency" },
];

const urgencyStyles = {
  urgent: {
    base: "bg-orange-100 text-orange-600",
    hover: "hover:bg-orange-200 hover:text-orange-700",
  },
  critical: {
    base: "bg-red-100 text-red-600",
    hover: "hover:bg-red-200 hover:text-red-700",
  },
};

const emergencies = [
  {
    title: "Diabetic Emergency",
    subtitle: "Hypoglycemia / Hyperglycemia",
    description:
      "Low or high blood sugar can cause serious complications. Quick recognition and action is important.",
    urgency: "urgent",
    icon: Droplet,
  },
  {
    title: "Burn Emergency",
    subtitle: "Thermal Burns",
    description:
      "Serious burns require immediate cooling and medical attention to prevent complications and reduce damage.",
    urgency: "urgent",
    icon: Flame,
  },
  {
    title: "Severe Bleeding Control",
    subtitle: "Hemorrhage",
    description:
      "Severe bleeding can be life-threatening. Quick action to stop bleeding is crucial.",
    urgency: "urgent",
    icon: Droplet,
  },
  {
    title: "Seizure Emergency",
    subtitle: "Epileptic Seizure",
    description:
      "During a seizure, the person may shake, lose consciousness, or become confused. Keep them safe from injury.",
    urgency: "urgent",
    icon: Brain,
  },
  {
    title: "Heart Attack Emergency",
    subtitle: "Myocardial Infarction",
    description:
      "A heart attack occurs when blood flow to the heart is blocked. Every second counts - immediate action can save a life.",
    urgency: "critical",
    icon: HeartPulse,
  },
  {
    title: "Stroke Emergency (FAST)",
    subtitle: "Cerebrovascular Accident",
    description:
      "A stroke occurs when blood supply to the brain is interrupted. Act FAST — time lost is brain lost.",
    urgency: "critical",
    icon: Brain,
  },
  {
    title: "CPR (Cardiopulmonary Resuscitation)",
    subtitle: "Cardiac Arrest",
    description:
      "CPR can save a life when someone's heart stops beating. Immediate CPR can double or triple chances of survival.",
    urgency: "critical",
    icon: HeartPulse,
  },
  {
    title: "Choking Emergency",
    subtitle: "Airway Obstruction",
    description:
      "When someone's airway is blocked, they can't breathe. Quick action with Heimlich maneuver can save their life.",
    urgency: "critical",
    icon: Wind,
  },
  {
    title: "Severe Allergic Reaction (Anaphylaxis)",
    subtitle: "Anaphylactic Shock",
    description:
      "A severe allergic reaction that can be life-threatening. Requires immediate epinephrine injection and emergency care.",
    urgency: "critical",
    icon: Zap,
  },
];

export default function Emergency() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Emergency Response Guide
        </h1>

        <p className="text-center text-gray-600 mt-3 text-lg">
          Critical first-aid procedures and immediate response steps
        </p>

        {/* Helplines */}
        <div className="mt-10 max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Helplines — Save These Numbers
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {helplines.map((h) => (
              <div
                key={h.number}
                className="bg-red-600 text-white rounded-lg py-3 text-center shadow"
              >
                <p className="text-lg font-bold">{h.number}</p>
                <p className="text-xs">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {emergencies.map((e, i) => {
            const Icon = e.icon;

            return (
              <div
                key={i}
                className="
          group bg-white rounded-2xl border border-gray-200
          shadow-sm transition-all duration-300 cursor-pointer
          hover:shadow-xl hover:-translate-y-1
          flex flex-col overflow-hidden
        "
              >
                {/* 🔴 Top red strip */}
                <div className="h-1 bg-red-600 w-full" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-red-600" />
                      <h3
                        className="
                  font-bold text-gray-900
                  transition-colors duration-300
                  group-hover:text-red-600
                "
                      >
                        {e.title}
                      </h3>
                    </div>

                    {/* Category badge */}
                    <span
                      className={`
    text-xs px-2 py-0.5 rounded-2xl font-semibold
    transition-colors cursor-pointer
    ${urgencyStyles[e.urgency].base}
    ${urgencyStyles[e.urgency].hover}
  `}
                    >
                      {e.urgency}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-gray-500 mb-2">{e.subtitle}</p>

                  {/* Description with ellipsis */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-6">
                    {e.description}
                  </p>

                  {/* CTA aligned at bottom */}
                  <button
                    className="
              mt-auto w-full py-2 rounded-lg text-sm font-medium
              border border-gray-200
              flex items-center justify-center gap-2
              transition-all duration-300
              group-hover:bg-red-600
              group-hover:text-white
              group-hover:border-red-600
            "
                  >
                    View Emergency Guide →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
