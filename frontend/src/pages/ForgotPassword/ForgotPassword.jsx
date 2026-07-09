import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    alert("Password reset link sent to your email. (Dummy Frontend)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-indigo-700">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Enter your registered email
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="relative">

            <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Send Reset Link
          </button>

        </form>

        <p className="text-center mt-8">

          <Link
            to="/"
            className="text-blue-600 font-semibold"
          >
            ← Back to Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default ForgotPassword;