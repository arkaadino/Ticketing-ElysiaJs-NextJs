import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useStatuses() {
  const [statusesList, setStatusesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<any | null>(null);


  useEffect(() => {
    fetchStatuses(); // 🔥 Ambil data statuses saat pertama kali load
  }, []);

  // 🔥 Fetch semua karyawan yang aktif
  const fetchStatuses = async () => {
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/statuses`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setStatusesList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        // tampilkan error lain selain "Data tidak ditemukan"
        showAlert("Error!", result.message, "error");
      } else {
        // kalau data memang kosong, set jadi [] tanpa alert
        setStatusesList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data status:", error);
      showAlert("Error!", "Gagal mengambil data status!", "error");
    } finally {
      setLoading(false);
    }    
  };

    const selectStatuses = useCallback(async (id: string): Promise<any | null> => {
      setLoading(true);
      try {
        const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/statuses/${id}`, {
          method: "GET",
          credentials: "include",
        });
  
        const result = await response.json();
        if (result.success) {
          setStatuses(result.data || null);
          return result.data; // Return the data
        } else {
          showAlert("Error!", result.message, "error");
          return null;
        }
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
        showAlert("Error!", "Failed to fetch statuses!", "error");
        return null;
      } finally {
        setLoading(false);
      }
    }, []);
  
    
// 🔥 Tambah statuses baru
const addStatuses = async (data: any) => {
  setLoading(true);
  try {
    const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/statuses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      // Jika ada error validasi dari server, kembalikan ke form untuk ditampilkan
      if (result.errors) {
        return { success: false, errors: result.errors };
      }
      
      // Jika error lain (bukan validasi), tampilkan Swal
      showAlert("Gagal!", result.message, "error");
      return { success: false, errors: {}};
    }

    showAlert("Berhasil!", "statuses berhasil ditambahkan.", "success").then(() => {
      fetchStatuses(); // Refresh data
    });

    return { success: true, errors: {}};
  } catch (error) {
    console.error("Gagal menambahkan statuses:", error);
    setLoading(false);
    showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
    return { success: false };
  }
};
  // 🔥 Update statuses
  const updateStatuses = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/statuses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        // Jika ada error validasi dari server, kembalikan ke form untuk ditampilkan
        if (result.errors) {
          return { success: false, errors: result.errors };
        }
        
        // Jika error lain (bukan validasi), tampilkan Swal
        showAlert("Gagal!", result.message, "error");
        return { success: false, errors: {}};
      }
  
      showAlert("Berhasil!", "data statuses diperbarui.", "success").then(() => {
        fetchStatuses();
      });

      return {success: true, errors: {}};
    } catch (error) {
      console.error("Gagal memperbarui statuses:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // 🔥 Soft delete statuses
  const deleteStatuses = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus statuses ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/statuses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Statuses telah dihapus.", "success").then(() => {
        fetchStatuses();
      });

      return true;
    } catch (error) {
      console.error("Gagal menghapus statuses:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  return { statusesList, statuses, loading, fetchStatuses, addStatuses, updateStatuses, deleteStatuses, selectStatuses };
}
