"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import useAuth from "@/hooks/useAuth";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth(); // Ambil data user dari useAuth
  const [displayName, setDisplayName] = useState("User");
  const [displayNik, setDisplayNik] = useState("N/A");
  const router = useRouter();

  useEffect(() => {
    // Prioritaskan data dari useAuth, fallback ke localStorage
    if (user?.name) {
      setDisplayName(user.name);
    } else {
      const storedName = localStorage.getItem('userName');
      if (storedName) setDisplayName(storedName);
    }

    if (user?.nik) {
      setDisplayNik(user.nik);
    } else {
      const storedNik = localStorage.getItem('userNik');
      if (storedNik) setDisplayNik(storedNik);
    }
  }, [user]);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
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
          {loading ? "Loading..." : displayName}
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {loading ? "Loading..." : displayName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {loading ? "Loading..." : displayNik}
          </span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 font-medium text-red-600 rounded-lg group text-theme-sm hover:bg-red-100 dark:hover:bg-red-900"
        >
          Logout
        </button>
      </Dropdown>
    </div>
  );
}