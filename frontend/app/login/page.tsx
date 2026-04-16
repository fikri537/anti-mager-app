"use client";

import { useState, FormEvent } from "react";
import { loginUser } from "@/services/api";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      if (res.success && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } else {
        alert(res.message || "Login gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-4">
      
      {/* BACKGROUND BLUR EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-20 blur-3xl"></div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4 text-white"
      >
        <h1 className="text-2xl font-bold text-center">🔥 Anti-Mager</h1>
        <p className="text-center text-sm opacity-80">Login ke akunmu</p>

        {/* EMAIL */}
        <input
          placeholder="Email"
          className="p-2 w-full rounded bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="p-2 w-full rounded bg-white/30 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* BUTTON */}
        <button className="bg-black/80 hover:bg-black transition w-full py-2 rounded font-semibold">
          Login
        </button>

        {/* REGISTER LINK */}
        <p className="text-sm text-center">
          Belum punya akun?{" "}
          <span
            onClick={() => router.push("/register")}
            className="underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}