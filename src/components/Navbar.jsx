import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Activity,
  Stethoscope,
  BookOpen,
  Shield,
  MapPin,
  AlertCircle,
  Globe,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Symptom Analyzer", icon: Activity, path: "/symptom-analyzer" },
  { label: "Symptom Checker", icon: Stethoscope, path: "/symptom-checker" },
  { label: "Diseases", icon: BookOpen, path: "/diseases" },
  { label: "Prevention", icon: Shield, path: "/prevention" },
  { label: "Find Clinics", icon: MapPin, path: "/clinics" },
  { label: "Emergency", icon: AlertCircle, path: "/emergency" },
  // { label: "My Assessments", icon: ClipboardList, path: "/assessments" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path, { replace: path === "/" });
    setOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <header
      className="
        sticky top-0 z-50
        bg-white/70 backdrop-blur-md
        supports-[backdrop-filter]:bg-white/60
        border-b border-white/30 shadow-lg
        transition-colors duration-300
        print-hide
      "
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo (unchanged) */}
        <Link
          to="/"
          replace
          onClick={() => window.scrollTo({ top: 0 })}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 cursor-pointer [&_*]:cursor-pointer"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #4F8CFF, #34D399)" }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6c-1.9-1.7-4.9-1.4-6.6.6L12 7.4l-2.2-2.2c-1.7-2-4.7-2.3-6.6-.6-2.1 1.9-2.2 5.1-.3 7.1l8.1 8.1 8.1-8.1c1.9-2 1.8-5.2-.3-7.1z" />
            </svg>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-blue-600">HealthBuddy</span>
            <span className="text-sm text-gray-600">Your Health Companion</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="mx-4 hidden lg:flex items-center flex-shrink-0 select-none">
          <div className="flex items-center gap-2 text-medium font-medium">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={i}
                  to={item.path}
                  replace={item.path === "/"}
                  className={`
  flex items-center gap-2 px-3 py-3 rounded-lg
  whitespace-nowrap leading-none
cursor-pointer select-none
[&_*]:cursor-pointer
  transition-all duration-200
  ${
    isActive
      ? "bg-blue-100 text-blue-600 font-semibold"
      : "text-gray-600 hover:bg-gray-200"
  }
`}
                >
                  <Icon size={16} className="shrink-0 pointer-events-none" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="hidden sm:flex items-center gap-1 border rounded-lg px-3 py-1.5 text-sm whitespace-nowrap">
            <Globe size={14} />
            English
          </button>

          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={i}
                  to={item.path}
                  replace={item.path === "/"}
                  onClick={() => setOpen(false)}
                  className={`
  flex items-center gap-2 px-3 py-3 rounded-lg
  whitespace-nowrap leading-none
  cursor-pointer select-none
  [&_*]:cursor-pointer
  transition-all duration-200
  ${
    isActive
      ? "bg-blue-100 text-blue-600 font-semibold"
      : "text-gray-600 hover:bg-gray-200"
  }
`}
                >
                  <Icon size={16} className="shrink-0 pointer-events-none" />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t">
              <button className="flex items-center gap-2 text-sm whitespace-nowrap">
                <Globe size={14} />
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
