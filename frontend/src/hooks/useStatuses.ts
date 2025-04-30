import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useStatuses() {
  const [statusesList, setStatusesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any | null>(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/statuses`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setStatusesList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        showAlert("Error!", result.message, "error");
      } else {
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
        setStatus(result.data || null);
        return result.data;
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
      showAlert("Error!", "Failed to fetch status!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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

      if (!response.ok) {
        if (result.errors) {
          return { success: false, errors: result.errors };
        }
        showAlert("Gagal!", result.message, "error");
        return { success: false, errors: {} };
      }

      showAlert("Berhasil!", "Status berhasil ditambahkan.", "success").then(fetchStatuses);
      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal menambahkan status:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

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

      if (!response.ok) {
        if (result.errors) {
          return { success: false, errors: result.errors };
        }
        showAlert("Gagal!", result.message, "error");
        return { success: false, errors: {} };
      }

      showAlert("Berhasil!", "Status berhasil diperbarui.", "success").then(fetchStatuses);
      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

  const deleteStatuses = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Yakin ingin menghapus status ini?");
    if (!confirm) return false;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/statuses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Status berhasil dihapus.", "success").then(fetchStatuses);
      return true;
    } catch (error) {
      console.error("Gagal menghapus status:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    statusesList,
    loading,
    status,
    fetchStatuses,
    addStatuses,
    updateStatuses,
    deleteStatuses,
    selectStatuses,
  };
}
