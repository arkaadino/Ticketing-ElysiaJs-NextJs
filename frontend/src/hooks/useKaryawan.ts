import { useState, useEffect } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";

export default function useKaryawan() {
  const [karyawanList, setKaryawanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKaryawan(); // 🔥 Ambil data karyawan saat pertama kali load
  }, []);

  // 🔥 Fetch semua karyawan yang aktif
  const fetchKaryawan = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/karyawan`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setKaryawanList(result.data);
      } else {
        showAlert("Error!", result.message, "error");
      }
    } catch (error) {
      console.error("Gagal mengambil data karyawan:", error);
      showAlert("Error!", "Gagal mengambil data karyawan!", "error");
    } finally {
      setLoading(false);
    }
  };

    
  // 🔥 Tambah karyawan baru
  const addKaryawan = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/karyawan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Karyawan berhasil ditambahkan", "success").then(() => {
        fetchKaryawan(); // Refresh data
      });

      return true;
    } catch (error) {
      console.error("Gagal menambahkan karyawan:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // 🔥 Update karyawan
  const updateKaryawan = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Data karyawan diperbarui", "success").then(() => {
        fetchKaryawan();
      });

      return true;
    } catch (error) {
      console.error("Gagal memperbarui karyawan:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // 🔥 Soft delete karyawan
  const deleteKaryawan = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus karyawan ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Karyawan telah dihapus", "success").then(() => {
        fetchKaryawan();
      });

      return true;
    } catch (error) {
      console.error("Gagal menghapus karyawan:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  return { karyawanList, loading, fetchKaryawan, addKaryawan, updateKaryawan, deleteKaryawan };
}
