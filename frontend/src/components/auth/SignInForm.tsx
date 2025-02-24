"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const data = { nik, password };
  
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🛠 Penting agar cookie dikirim otomatis!
        body: JSON.stringify(data),
      });

      const result = await response.json();
  
      if (!response.ok) {
        Swal.fire({
          title: "Error!",
          text: result.message,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ac2f1d",
        });
        return;
      }

      Swal.fire({
        title: "Success!",
        text: "Selamat Datang!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#2c9830",
      }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-white text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-100 dark:text-gray-400">
              Hello, Welcome aboard!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    NIK <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Enter your NIK"
                    isSignIn={true}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      isSignIn={true}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full bg-brand-900" variant="outline" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
