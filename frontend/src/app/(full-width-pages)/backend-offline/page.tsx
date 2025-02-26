import React from "react";
import Link from "next/link";

export default function BackendOffline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-4">Backend Server Offline</h1>
      <p className="text-lg text-center max-w-md mb-6">
        The backend server is currently unreachable. This may be due to
        maintenance, network issues, or an unexpected error. Please try again
        later.
      </p>
      <Link
        href="/"
        className="px-5 py-3 text-white bg-brand-900 hover:bg-brand-950 rounded-lg text-sm font-medium transition variant-outline"
      >
        Try Again
      </Link>
      
    </div>
  );
}
