"use client";

import { useState, FormEvent } from "react";
import { registerUser } from "@/services/api";
import { useRouter } from "next/navigation";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await registerUser(form);

      if (res.success) {
        setSuccess("Account created successfully 🚀");

        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden px-4">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-120px] bottom-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl"
      >

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">
            Anti<span className="text-cyan-400">Mager</span>
          </h1>

          <p className="text-white/40 text-sm mt-2">
            Create your account and start leveling up
          </p>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-center text-emerald-300 text-sm">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-center text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* INPUTS */}
        <div className="space-y-4">

          <input
            placeholder="Name"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50 transition"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50 transition"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50 transition"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className={`
            mt-6 w-full rounded-2xl py-3 font-semibold transition
            ${
              loading
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:opacity-90"
            }
          `}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}