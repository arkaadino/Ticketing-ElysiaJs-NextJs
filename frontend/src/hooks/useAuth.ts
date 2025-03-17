import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useAuth() {
  const [user, setUser] = useState<{ name?: string; nik?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUser(); // 🔥 Fetch user saat halaman pertama kali dimuat
  }, []);

  const getUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Simpan user data ke localStorage saat berhasil mendapatkan data
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userNik', result.user.nik);
        localStorage.setItem('userRole', result.user.role);
        setUser(result.user);
      } else {
        // Jika API call gagal, coba ambil dari localStorage
        const userName = localStorage.getItem('userName');
        const userNik = localStorage.getItem('userNik');
        const userRole = localStorage.getItem('userRole');
        
        if (userName && userNik) {
          setUser({ name: userName, nik: userNik, role: userRole || undefined });
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Gagal mendapatkan data user:", error);
      // Jika terjadi error, coba ambil dari localStorage
      const userName = localStorage.getItem('userName');
      const userNik = localStorage.getItem('userNik');
      const userRole = localStorage.getItem('userRole');
      
      if (userName && userNik) {
        setUser({ name: userName, nik: userNik, role: userRole || undefined });
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (nik: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nik, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Error!", result.message, "error");
        return false;
      }

      // Simpan data user ke localStorage saat login berhasil
      if (result.success && result.user) {
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userNik', result.user.nik);
        localStorage.setItem('userRole', result.user.role);
        setUser(result.user);
      }

      showAlert("Success!", "Selamat Datang!", "success").then(() => {
        window.location.href = "/";
      });

      return true;
    } catch (error) {
      console.error("Network error:", error);
      setLoading(false);
      showAlert("Error!", "Network error, coba lagi!", "error");
      return false;
    }
  };

  const logout = async () => {
    const confirm = await showConfirm("Konfirmasi Logout", "Apakah Anda yakin ingin logout?");
    if (!confirm) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Hapus data dari localStorage saat logout
        localStorage.removeItem('userName');
        localStorage.removeItem('userNik');
        localStorage.removeItem('userRole');
        setUser(null);
        showAlert("Berhasil!", "Anda telah logout.", "success").then(() => {
          router.replace("/signin");
        });
      } else {
        showAlert("Gagal!", result.message || "Logout gagal!", "error");
      }
    } catch (error) {
      showAlert("Error!", "Terjadi kesalahan saat logout.", "error");
    }
  };

  return { user, loading, login, logout };
}