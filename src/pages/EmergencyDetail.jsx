import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle, Phone } from "lucide-react";
import { CheckCircle2, XCircle } from "lucide-react";
import emergencyData from "../data/emergencies.json"; // ✅ FIXED PATH

/* ---------- Icons ---------- */

function AlertIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 text-red-600 ${className}`}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function EmergencyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = emergencyData?.[slug]; // ✅ safe access

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button always visible */}
        <button
          onClick={() => navigate("/emergency")}
          className="flex items-center gap-2 text-lg font-semibold
                     text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Emergency Guides
        </button>

        {!data ? (
          /* ---------- FALLBACK ---------- */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Emergency Guide Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              This emergency guide is not available yet.
            </p>
          </div>
        ) : (
          /* ---------- MAIN CONTENT ---------- */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-2 bg-orange-500" />

            <div className="p-8">
              {/* Urgency badge */}
              <span
                className={`inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-2xl
                  font-semibold text-sm
                  ${
                    data.urgency === "critical"
                      ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-600"
                  }
                `}
              >
                {data.urgency.toUpperCase()}
              </span>

              <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>

              <p className="text-gray-500 mb-4">{data.subtitle}</p>

              {/* Callout */}
              <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                <p className="text-red-800">
                  <strong>Call Emergency Services First.</strong>
                  <br />
                  Dial 108 or 112 immediately.
                </p>
              </div>

              {/* About */}
              <Section title="About This Emergency">{data.about}</Section>

              {/* Recognize */}
              <h3 className="text-xl font-semibold mt-8 mb-3 flex gap-2">
                <AlertIcon /> How to Recognize
              </h3>

              <ul className="space-y-3">
                {data.recognize.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 bg-orange-50 border border-orange-100 p-3 rounded-xl"
                  >
                    <AlertIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Steps */}
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl mt-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  ⚡ Immediate Action Steps
                </h3>

                <ol className="space-y-3">
                  {data.steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* DO / DON'T */}
              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                <Checklist title="DO" items={data.dos} type="do" />
                <Checklist title="DON'T" items={data.donts} type="dont" />
              </div>

              {/* Helplines */}
              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">
                <p className="flex items-center gap-2 font-semibold text-red-700 mb-4">
                  <Phone className="w-4 h-4" />
                  Emergency Helplines
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="tel:108"
                    className="bg-white border border-red-300 rounded-lg py-3 text-center
                 font-semibold text-red-700 hover:bg-red-600 hover:text-white
                 transition-all cursor-pointer"
                  >
                    108
                    <div className="text-xs font-normal">Ambulance</div>
                  </a>

                  <a
                    href="tel:104"
                    className="bg-white border border-red-300 rounded-lg py-3 text-center
                 font-semibold text-red-700 hover:bg-red-600 hover:text-white
                 transition-all cursor-pointer"
                  >
                    104
                    <div className="text-xs font-normal">Health Helpline</div>
                  </a>

                  <a
                    href="tel:102"
                    className="bg-white border border-red-300 rounded-lg py-3 text-center
                 font-semibold text-red-700 hover:bg-red-600 hover:text-white
                 transition-all cursor-pointer"
                  >
                    102
                    <div className="text-xs font-normal">Medical Emergency</div>
                  </a>

                  <a
                    href="tel:112"
                    className="bg-white border border-red-300 rounded-lg py-3 text-center
                 font-semibold text-red-700 hover:bg-red-600 hover:text-white
                 transition-all cursor-pointer"
                  >
                    112
                    <div className="text-xs font-normal">
                      National Emergency
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- Helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{children}</p>
    </div>
  );
}

function Checklist({ title, items, type }) {
  const Icon = type === "do" ? CheckCircle2 : XCircle;
  const color = type === "do" ? "green" : "red";

  return (
    <div className="bg-gray-50 border rounded-xl p-4">
      <h4 className={`text-${color}-700 font-semibold mb-3`}>{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <Icon className={`w-4 h-4 text-${color}-600 mt-0.5`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
