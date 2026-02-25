import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../services/auth";
import { useTheme } from "../context/ThemeContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
FORM HANDLING
========================== */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
EMAIL LOGIN
========================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await loginWithEmail(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  /* =========================
GOOGLE LOGIN
========================== */
  const handleGoogleLogin = async () => {
    setError("");

    try {
      setLoading(true);
      const result = await loginWithGoogle();

      if (result.isNewUser) {
        navigate("/onboarding"); // future page
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  /* =========================
FRIENDLY ERRORS
========================== */
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later";
      default:
        return "Login failed. Please try again";
    }
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-32 px-4 flex justify-center
        ${isDark ? "bg-[#0f172a]" : "bg-slate-50"}
      `}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-8 shadow-xl border
          ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}
        `}
      >
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back </h2>
        <p className="text-sm text-center mb-6 opacity-70">
          Login to continue to Rurivia AI
        </p>
        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100/20 p-2 rounded-lg">
            {error}
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 opacity-60" size={18} />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className={`
            w-full pl-10 pr-3 py-2 rounded-lg border outline-none
            ${
              isDark
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-slate-300"
            }
          `}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 opacity-60" size={18} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className={`
            w-full pl-10 pr-10 py-2 rounded-lg border outline-none
            ${
              isDark
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-slate-300"
            }
          `}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm opacity-70">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`
  w-full py-2 rounded-lg border font-medium transition
  disabled:opacity-60 disabled:cursor-not-allowed
  ${
    isDark
      ? "border-slate-600 hover:bg-slate-800"
      : "border-slate-300 hover:bg-slate-100"
  }
`}
        >
          Continue with Google
        </button>
        {/* Signup link */}
        <p className="text-sm text-center mt-6 opacity-70">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
