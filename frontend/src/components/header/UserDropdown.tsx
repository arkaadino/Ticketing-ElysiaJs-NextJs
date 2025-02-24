"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth";
import "@/styles/swal.css";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth(); // Ambil data user dari useAuth
  const router = useRouter();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Logout!",
      cancelButtonText: "Batal",


    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:5000/auth/logout", {
          method: "POST",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              Swal.fire("Berhasil!", "Anda telah logout.", "success").then(() => {
                router.replace("/signin");
              });
            } else {
              Swal.fire("Gagal!", data.message || "Logout gagal!", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error!", "Terjadi kesalahan saat logout.", "error");
          });
      }
    });
  }

  return (
    <div className="relative z-9999999">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
        disabled={loading}
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image width={44} height={44} src="/images/user/owner.jpg" alt="User" />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {loading ? "Loading..." : user?.name || "User"}
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {loading ? "Loading..." : user?.name || "User"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {loading ? "Loading..." : user?.nik || "N/A"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 font-medium text-red-600 rounded-lg group text-theme-sm hover:bg-red-100 dark:hover:bg-red-900"
        >
          Logout
        </button>
      </Dropdown>
    </div>
  );
}
