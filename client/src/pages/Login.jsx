import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import api from "../apiConfig";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });


  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setServerError("");
      try {
        const res = await api.post("/api/auth/google", {
          credential: tokenResponse.access_token,
        });
        const { token, user, requiresProfileCompletion } = res.data;
        if (requiresProfileCompletion) {
          localStorage.setItem("tempToken", token);
          localStorage.setItem("tempUser", JSON.stringify(user));
          window.location.href = "/complete-profile";
        } else {
          login(user, token);
        }
      } catch (err) {
        setServerError(err.response?.data?.message || "Google sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setServerError("Google sign-in failed. Please try again.");
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", {
        email: data.email,
        password: data.password,
        role,
      });
      const { token, user } = response.data;
      if (token && user) {
        login(user, token);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Invalid credentials or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-10">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white text-[11px] font-black select-none">
            CH
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">ConnectingHostels</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1 text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          Sign in to your account
        </p>

        {/* Role Toggle */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 gap-1">
          {["student", "owner"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === r
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {r === "student" ? "Student" : "Hostel Owner"}
            </button>
          ))}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Signing in…" : `Sign in as ${role}`}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 font-medium py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? (
            "Signing in…"
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Continue with Google
            </>
          )}
        </button>

        <p className="text-center text-sm mt-5 text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Create one
          </Link>
        </p>

        <p className="text-center text-xs mt-3 text-slate-400 dark:text-slate-500">
          By continuing, you agree to our{" "}
          <Link to="/legal/terms-and-conditions" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms</Link>
          {" "}and{" "}
          <Link to="/legal/privacy-policy" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
