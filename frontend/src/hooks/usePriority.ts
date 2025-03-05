import { useState, useEffect } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";

export default function usePriority() {
  const [PriorityList, setPriorityList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriority(); // 🔥 Ambil data priority saat pertama kali load
  }, []);

  // 🔥 Fetch semua karyawan yang aktif
  const fetchPriority = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/priority`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setPriorityList(result.data);
      } else {
        showAlert("Error!", result.message, "error");
      }
    } catch (error) {
      console.error("Gagal mengambil data priority:", error);
      showAlert("Error!", "Gagal mengambil data priority!", "error");
    } finally {
      setLoading(false);
    }
  };

    
  // 🔥 Tambah karyawan baru
  const addPriority = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/priority`, {
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

      showAlert("Berhasil!", "priority berhasil ditambahkan.", "success").then(() => {
        fetchPriority(); // Refresh data
      });

      return true;
    } catch (error) {
      console.error("Gagal menambahkan priority:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // 🔥 Update priority
  const updatePriority = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/priority/${id}`, {
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

      showAlert("Berhasil!", "data priority diperbarui.", "success").then(() => {
        fetchPriority();
      });

      return true;
    } catch (error) {
      console.error("Gagal memperbarui priority:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // 🔥 Soft delete priority
  const deletePriority = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus karyawan ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/priority/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Karyawan telah dihapus (soft delete).", "success").then(() => {
        fetchPriority();
      });

      return true;
    } catch (error) {
      console.error("Gagal menghapus priority:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  return { PriorityList, loading, fetchPriority, addPriority, updatePriority, deletePriority };
}
