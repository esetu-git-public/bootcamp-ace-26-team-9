import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      toast.success("Login Successful!");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-500 flex">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 text-white p-16 flex-col justify-center">

        <h1 className="text-6xl font-bold mb-6">
          Employee Attrition
        </h1>

        <h2 className="text-4xl font-semibold mb-6">
          Prediction System
        </h2>

        <p className="text-xl leading-9 text-blue-100">
          Empower HR teams with AI-driven insights to predict employee
          attrition and improve workforce retention.
        </p>

      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">

          <h2 className="text-4xl font-bold text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-8">
            Login to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Email */}

            <label className="font-medium">
              Email
            </label>

            <div className="relative mt-2">

              <Mail
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-12"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email",
                  },
                })}
              />

            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-1 mb-4">
                {errors.email.message}
              </p>
            )}

            {/* Password */}

            <label className="font-medium">
              Password
            </label>

            <div className="relative mt-2">

              <Lock
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-12 pr-12"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1 mb-6">
                {errors.password.message}
              </p>
            )}

            <div className="flex justify-between text-sm mb-6">

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
              </label>

              <a
                href="#"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>

            </div>

            <Button
              type="submit"
              loading={loading}
            >
              Login
            </Button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;