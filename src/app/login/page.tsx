"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, isAuthenticated } from "@/lib/api";
import { SparkleIcon } from "@/components/icons";

// --- Clean, consistent stroke icons ---
function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.5 3.7-5.5 7-5.5s6.2 2 7 5.5" />
    </svg>
  );
}

function EyeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3l18 18" />
      <path d="M10.5 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17.4 17.4 0 0 1-2.4 3.1M6.6 6.9C4 8.8 2.5 12 2.5 12S6 18 12 18c1.2 0 2.3-.2 3.3-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function AlertIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

// Google Blue primary color
const GOOGLE_BLUE = "#1a73e8";

const features = [
  {
    title: "AI-powered documentation",
    desc: "Auto-generated docs for every route, service, and model in your codebase.",
  },
  {
    title: "Architecture explorer",
    desc: "Visualize how your services, databases, and integrations connect.",
  },
  {
    title: "Always in sync",
    desc: "Knowledge base updates automatically as your code evolves.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        if (response.status === 200 && response.data?.access_token) {
          localStorage.setItem("token", response.data.access_token);
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          setError(
            response.message || "Invalid credentials. Please try again.",
          );
        }
      } else {
        const response = await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, full_name: fullName }),
        });

        if (response.status === 201) {
          setSuccess("Registration successful! You can now log in.");
          setIsLogin(true);
          setFullName("");
        } else {
          setError(response.message || "Registration failed. Try again.");
        }
      }
    } catch (err: any) {
      setError("Something went wrong. Please connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setError("");
    setSuccess("");
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1a73e8] focus:ring-[3px] focus:ring-[#1a73e8]/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-600 dark:focus:border-[#1a73e8]";

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-neutral-950 font-sans">
      {/* ===== Left brand panel (Google Blue) ===== */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#1a73e8] p-12 lg:flex">
        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Soft ambient glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-white/10 blur-[100px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/20">
            <SparkleIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            DocuMind
          </span>
        </div>

        {/* Headline + features */}
        <div className="relative max-w-[420px]">
          <h2 className="text-[34px] font-semibold leading-[1.15] tracking-tight text-white">
            Your codebase,
            <br />
            <span className="text-blue-100">fully understood.</span>
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-blue-100">
            Living documentation, architecture maps, and an AI that answers
            questions about your code — always up to date.
          </p>

          <div className="mt-10 space-y-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/10">
                  <CheckIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <div className="text-[15px] font-medium text-white">
                    {f.title}
                  </div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-blue-200">
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-[13px] text-blue-200">
          © {new Date().getFullYear()} DocuMind. All rights reserved.
        </div>
      </div>

      {/* ===== Right form panel ===== */}
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-10">
        {/* Soft ambient glow */}
        <div className="pointer-events-none absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#1a73e8]/5 blur-[100px] dark:bg-[#1a73e8]/10" />

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1a73e8]/10">
              <SparkleIcon className="h-5 w-5 text-[#1a73e8]" />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">
              DocuMind
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-slate-900 dark:text-white">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-[14px] text-slate-500 dark:text-neutral-400">
              {isLogin
                ? "Sign in to access your codebase documentation."
                : "Start documenting your codebase in minutes."}
            </p>
          </div>

          {/* Segmented toggle */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`rounded-md py-2 text-[13px] font-medium transition ${
                isLogin
                  ? "bg-white text-slate-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-neutral-500 dark:hover:text-neutral-300"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`rounded-md py-2 text-[13px] font-medium transition ${
                !isLogin
                  ? "bg-white text-slate-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-neutral-500 dark:hover:text-neutral-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertIcon className="mt-px h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[13px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckIcon className="mt-px h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-neutral-300">
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700 dark:text-neutral-300">
                Email address
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[13px] font-medium text-slate-700 dark:text-neutral-300">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-[12.5px] font-medium text-[#1a73e8] hover:underline dark:text-blue-400"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isLogin ? "Enter your password" : "Minimum 8 characters"
                  }
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1.5 text-[12px] text-slate-400 dark:text-neutral-500">
                  Must be at least 8 characters long.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a73e8] py-2.5 text-[14px] font-semibold text-white shadow-sm shadow-[#1a73e8]/20 transition hover:bg-[#1557b0] focus:outline-none focus:ring-[3px] focus:ring-[#1a73e8]/25 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer switch */}
          <p className="mt-6 text-center text-[13px] text-slate-500 dark:text-neutral-500">
            {isLogin ? "New to DocuMind?" : "Already have an account?"}{" "}
            <button
              onClick={() => switchMode(!isLogin)}
              className="font-semibold text-[#1a73e8] hover:underline dark:text-blue-400"
            >
              {isLogin ? "Create an account" : "Sign in instead"}
            </button>
          </p>

          {/* Terms */}
          <p className="mt-8 text-center text-[11.5px] leading-relaxed text-slate-400 dark:text-neutral-600">
            By continuing, you agree to DocuMind's{" "}
            <a
              href="#"
              className="underline hover:text-slate-600 dark:hover:text-neutral-400"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-slate-600 dark:hover:text-neutral-400"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
