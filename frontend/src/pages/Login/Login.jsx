import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTie,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter Email and Password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email.");
      return;
    }

    // Temporary Login
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-700 to-indigo-700">

      {/* Left Side */}

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center text-white p-12">

        <div className="text-center">

          <FaUserTie className="text-8xl mx-auto mb-8" />

          <h1 className="text-5xl font-bold mb-6">
            Employee Attrition
          </h1>

          <h2 className="text-5xl font-bold mb-6">
            Prediction
          </h2>

          <p className="text-xl leading-8 opacity-90">
            Predict employee attrition using AI-powered
            analytics and help HR teams make better decisions.
          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex-1 flex items-center justify-center p-8">

        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mb-8">
            Sign in to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}

            <div>

              <label className="block font-semibold mb-2">
                Email
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="block font-semibold mb-2">
                Password
              </label>

              <div className="relative">

                <FaLock className="absolute left-4 top-4 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:border-blue-600"
                />

                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-500"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* Remember */}

            <div className="flex justify-between items-center">

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                Remember Me

              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Button */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold"
            >
              Login
            </button>

          </form>

          {/* Register */}

          <p className="text-center mt-8 text-gray-600">

            New User?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-2"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;