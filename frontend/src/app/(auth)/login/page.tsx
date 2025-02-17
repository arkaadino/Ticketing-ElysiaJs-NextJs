"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/loginsave", {
        method: "POST",
        credentials: "include", // Supaya cookie tersimpan
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nik, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");

      // Redirect ke dashboard setelah login berhasil
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-950">
      <div className="w-full max-w-md rounded-lg border border-stroke bg-slate-50  p-8 shadow-lg">
        <h2 className="text-center text-xl font-bold">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              NIK
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border px-4 py-2"
              placeholder="Masukkan NIK Anda"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border px-4 py-2"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 px-4 py-2 text-white rounded-lg hover:bg-blue-950"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
