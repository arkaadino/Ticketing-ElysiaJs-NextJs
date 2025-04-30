import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "../components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useEskalasi() {
  const [eskalasiList, setEskalasiList] = useState<any[]>([]);
  const [eskalasi, setEskalasi] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEskalasi();
  }, []);

  const fetchEskalasi = async () => {
    try {
      setLoading(true);
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setEskalasiList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        showAlert("Error!", result.message, "error");
      } else {
        setEskalasiList([]);
      }
    } catch (error) {
      console.error("Failed to fetch eskalasi:", error);
      showAlert("Error!", "Failed to fetch eskalasi!", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectEskalasi = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setEskalasi(result.data || null);
        return result.data;
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch eskalasi:", error);
      showAlert("Error!", "Failed to fetch eskalasi!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addEskalasi = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi`, {
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

      showAlert("Berhasil!", "Eskalasi berhasil ditambahkan.", "success").then(fetchEskalasi);
      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal menambahkan eskalasi:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

  const updateEskalasi = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi/${id}`, {
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

      showAlert("Berhasil!", "Eskalasi berhasil diperbarui.", "success").then(fetchEskalasi);
      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal memperbarui eskalasi:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

  const deleteEskalasi = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Yakin ingin menghapus eskalasi ini?");
    if (!confirm) return false;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Eskalasi berhasil dihapus.", "success").then(fetchEskalasi);
      return true;
    } catch (error) {
      console.error("Gagal menghapus eskalasi:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    eskalasiList,
    eskalasi,
    loading,
    fetchEskalasi,
    addEskalasi,
    updateEskalasi,
    deleteEskalasi,
    selectEskalasi,
  };
}
