import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useTicketing() {
  const [ticketingList, setTicketingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketing, setTicketing] = useState<any | null>(null);


  useEffect(() => {
    fetchTicketing(); // 🔥 Ambil data ticketing saat pertama kali load
  }, []);

  // 🔥 Fetch semua karyawan yang aktif
  const fetchTicketing = async () => {
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setTicketingList(result.data);
      } else {
        showAlert("Error!", result.message, "error");
      }
    } catch (error) {
      console.error("Gagal mengambil data ticketing:", error);
      showAlert("Error!", "Gagal mengambil data ticketing!", "error");
    } finally {
      setLoading(false);
    }
  };

    const selectTicketing = useCallback(async (id: string): Promise<any | null> => {
      setLoading(true);
      try {
        const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/${id}`, {
          method: "GET",
          credentials: "include",
        });
  
        const result = await response.json();
        if (result.success) {
          setTicketing(result.data || null);
          return result.data; // Return the data
        } else {
          showAlert("Error!", result.message, "error");
          return null;
        }
      } catch (error) {
        console.error("Failed to fetch ticketing:", error);
        showAlert("Error!", "Failed to fetch ticketing!", "error");
        return null;
      } finally {
        setLoading(false);
      }
    }, []);
  
    
// 🔥 Tambah ticketing baru
const addTicketing = async (data: any) => {
  setLoading(true);
  try {
    const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings`, {
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

    showAlert("Berhasil!", "ticketing berhasil ditambahkan.", "success").then(() => {
      fetchTicketing(); // Refresh data
    });

    return { success: true, errors: {}};
  } catch (error) {
    console.error("Gagal menambahkan ticketing:", error);
    setLoading(false);
    showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
    return { success: false };
  }
};
  // 🔥 Update ticketing
  const updateTicketing = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/${id}`, {
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
  
      showAlert("Berhasil!", "Data ticketing diperbarui.", "success").then(() => {
        fetchTicketing();
      });

      return {success: true, errors: {}};
    } catch (error) {
      console.error("Gagal memperbarui ticketing:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // 🔥 Soft delete ticketing
  const deleteTicketing = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus ticketing ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Ticketing telah dihapus.", "success").then(() => {
        fetchTicketing();
      });

      return true;
    } catch (error) {
      console.error("Gagal menghapus ticketing:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  return { ticketingList, ticketing, loading, fetchTicketing, addTicketing, updateTicketing, deleteTicketing, selectTicketing };
}
