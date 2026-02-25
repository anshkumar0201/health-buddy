import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupWithEmail, signupWithGoogle } from "../services/auth";
import { useTheme } from "../context/ThemeContext";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "An account already exists with this email";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/weak-password":
        return "Password should be stronger";
      case "auth/network-request-failed":
        return "Network error. Check your connection";
      default:
        return "Signup failed. Please try again";
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await signupWithEmail(form.name.trim(), form.email.trim(), form.password);

      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    try {
      setLoading(true);
      await signupWithGoogle();
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
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
        {/* Title */}{" "}
        <h2 className="text-2xl font-bold mb-2 text-center">Create Account </h2>
        <p className="text-sm text-center mb-6 opacity-70">
          Join Rurivia AI to start your health journey
        </p>
        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100/20 p-2 rounded-lg">
            {error}
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 opacity-60" size={18} />
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Full Name"
              required
              value={form.name}
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
              autoComplete="new-password"
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
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm opacity-70">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className={`
        w-full py-2 rounded-lg border font-medium transition cursor-pointer
        ${
          isDark
            ? "border-slate-600 hover:bg-slate-800"
            : "border-slate-300 hover:bg-slate-100"
        }
      `}
        >
          Continue with Google
        </button>
        {/* Login link */}
        <p className="text-sm text-center mt-6 opacity-70">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
