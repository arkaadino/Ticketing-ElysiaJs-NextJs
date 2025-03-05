import React from "react";
import Link from "next/link";

export default function BackendOffline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-4">Gangguan Akses Server Backend!</h1>
      <p className="text-lg text-center max-w-md mb-6">
      Server backend saat ini tidak dapat diakses. Hal ini mungkin disebabkan oleh adanya maintenance, gangguan jaringan, atau kesalahan yang tidak terduga. 
      Kami mohon maaf atas ketidaknyamanan ini. Silahkan coba kembali dalam beberapa saat, 
      atau hubungi tim dukungan jika masalah terus berlanjut.      
      </p>
      <Link
        href="/"
        className="px-5 py-3 text-white bg-brand-900 hover:bg-brand-950 rounded-lg text-sm font-medium transition variant-outline"
      >
        Refresh
      </Link>
      
    </div>
  );
}
