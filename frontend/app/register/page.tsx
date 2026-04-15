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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registerUser(form);
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Register gagal");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>

        <input
          placeholder="Name"
          className="border p-2 w-full"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-black text-white px-4 py-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}