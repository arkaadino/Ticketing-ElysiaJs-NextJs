import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function usePriority() {
  const [priorityList, setPriorityList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [priority, setPriority] = useState<any | null>(null);

  useEffect(() => {
    fetchPriority();
  }, []);

  const fetchPriority = async () => {
    try {
      setLoading(true);
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/priority`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setPriorityList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        showAlert("Error!", result.message, "error");
      } else {
        setPriorityList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data priority:", error);
      showAlert("Error!", "Gagal mengambil data priority!", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectPriority = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/priority/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setPriority(result.data || null);
        return result.data;
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch priority:", error);
      showAlert("Error!", "Failed to fetch priority!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPriority = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/priority`, {
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

      showAlert("Berhasil!", "Priority berhasil ditambahkan.", "success").then(fetchPriority);
      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal menambahkan priority:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

  const updatePriority = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/priority/${id}`, {
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

      showAlert("Berhasil!", "Priority berhasil diperbarui.", "success").then(fetchPriority);
      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal memperbarui priority:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

  const deletePriority = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Yakin ingin menghapus priority ini?");
    if (!confirm) return false;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/priority/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Priority berhasil dihapus.", "success").then(fetchPriority);
      return true;
    } catch (error) {
      console.error("Gagal menghapus priority:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    priorityList,
    loading,
    priority,
    fetchPriority,
    addPriority,
    updatePriority,
    deletePriority,
    selectPriority,
  };
}
