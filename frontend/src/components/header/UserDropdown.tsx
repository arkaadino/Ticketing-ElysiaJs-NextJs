"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import useAuth from "@/hooks/useAuth";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [displayName, setDisplayName] = useState("User");
  const [displayNik, setDisplayNik] = useState("N/A");
  const [displayRole, setDisplayRole] = useState("User");
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

    // Add role information if available
    if (user?.role) {
      setDisplayRole(user.role);
    } else {
      const storedRole = localStorage.getItem('userRole');
      if (storedRole) setDisplayRole(storedRole);
    }
  }, [user]);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Function to handle profile navigation
  function goToProfile() {
    router.push('/profile');
    closeDropdown();
  }

  // Function to handle settings navigation
  function goToSettings() {
    router.push('/settings');
    closeDropdown();
  }

  return (
    <div className="relative z-9999999">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 rounded-full bg-white px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-50 transition-all dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        disabled={loading}
      >
        <span className="overflow-hidden rounded-full h-9 w-9 ring-2 ring-blue-500 ring-offset-1">
          <Image width={500} height={500} src="/images/user/owner.png" alt="User" className="h-full w-full object-cover" />
        </span>

        <span className="hidden md:block min-w-[120px] text-left">
          <span className="block font-medium text-theme-sm">{loading ? "Loading..." : displayName}</span>
          <span className="block text-theme-xs text-blue-600 dark:text-blue-400">
              Admin
          </span>
        </span>
        
        <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 flex w-[280px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 dark:border-gray-700">
          <span className="overflow-hidden rounded-full h-12 w-12 ring-2 ring-blue-500">
            <Image width={500} height={500} src="/images/user/owner.png" alt="User" className="h-full w-full object-cover" />
          </span>
          <div className="text-left">
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-200">
              {loading ? "Loading..." : displayName}
            </span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              NIK: {loading ? "Loading..." : displayNik}
            </span>
            <span className="block text-theme-xs text-blue-600 dark:text-blue-400">
              Admin
            </span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-col gap-1">
          
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 font-medium text-red-600 rounded-lg text-theme-sm hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </Dropdown>
    </div>
  );
}