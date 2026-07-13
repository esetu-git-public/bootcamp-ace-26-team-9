import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserTie } from "react-icons/fa";
import { supabase, isSupabaseConfigured } from "../../services/supabaseClient";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        localStorage.setItem("local_auth_session", JSON.stringify({ user: { email: form.email, name: form.name, role: "HR Manager" } }));
        alert("Registration Successful!");
        navigate("/dashboard");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            display_name: form.name,
          },
        },
      });

      if (error) {
        setErrors({ general: error.message || "Registration failed. Please try again." });
      } else {
        alert("Registration Successful! Please check your email for a confirmation link (if enabled in Supabase).");
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 flex items-center justify-center px-6 py-10">

      <div className="grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-12">

          <FaUserTie size={90} />

          <h1 className="text-5xl font-extrabold text-center mt-8">
            Employee
            <br />
            Attrition Prediction
          </h1>

          <p className="text-center mt-8 leading-8 text-blue-100">
            Join the AI-powered HR analytics platform to monitor, analyze, and predict employee attrition risk levels.
          </p>

        </div>

        {/* RIGHT PANEL */}
        <div className="p-12">

          <div className="mb-6">

            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm">
              Employee Attrition Prediction System
            </p>

            <h2 className="text-4xl font-bold mt-2 text-gray-800">
              Create Account 🚀
            </h2>

            <p className="text-gray-500 mt-2">
              Register to get started.
            </p>

          </div>

          {/* General error message */}
          {errors.general && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              {errors.general}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?
            <Link
              to="/"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;