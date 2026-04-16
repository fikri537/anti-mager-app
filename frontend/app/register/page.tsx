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
        setSuccess("Register berhasil 🎉 Redirecting...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(res.message || "Register gagal");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-4 overflow-hidden">
      
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-20 blur-3xl"></div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4 text-white"
      >
        <h1 className="text-2xl font-bold text-center">🔥 Anti-Mager</h1>
        <p className="text-center text-sm opacity-80">
          Buat akun baru
        </p>

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-500/80 text-white text-sm p-2 rounded text-center">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/80 text-white text-sm p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* NAME */}
        <input
          placeholder="Name"
          className="p-2 w-full rounded bg-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          placeholder="Email"
          className="p-2 w-full rounded bg-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="p-2 w-full rounded bg-white/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2 rounded font-semibold transition
          ${
            loading
              ? "bg-black/50 cursor-not-allowed"
              : "bg-black/80 hover:bg-black"
          }`}
        >
          {loading ? "Loading..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center">
          Sudah punya akun?{" "}
          <span
            onClick={() => router.push("/login")}
            className="underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}