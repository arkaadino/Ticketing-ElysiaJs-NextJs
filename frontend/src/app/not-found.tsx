import { FC } from "react";
import Link from "next/link";

const Custom404: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950 text-white text-center">
      <div className="bg-white bg-opacity-20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/20 animate-pulse">
        <h1 className="cursor-pointer text-9xl font-black tracking-widest drop-shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
          404
        </h1>
        <p className="cursor-pointer text-2xl font-bold mt-4 uppercase transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
          Halaman Tidak Ditemukan!
        </p>
        <p className="cursor-pointer text-lg mt-2 text-gray-200 font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
          Rel tujuan ini belum tersedia, saatnya kembali ke jalur utama.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block px-8 py-3 bg-white text-black font-bold text-lg rounded-full shadow-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
