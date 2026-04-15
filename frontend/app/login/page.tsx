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

      if (res.token) {
        localStorage.setItem("token", res.token);
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
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-black text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}