import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "../components/ui/swal/swal"; 
import { fetchWithRefresh } from "@/utils/api";

export default function useKaryawan() {
  const [karyawanList, setKaryawanList] = useState<any[]>([]);
  const [karyawan, setKaryawan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKaryawan(); 
  }, []);

  const fetchKaryawan = async () => {
    try {
      setLoading(true);

      const response = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/karyawan`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        setKaryawanList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        showAlert("Error!", result.message, "error");
      } else {
        setKaryawanList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data karyawan:", error);
      showAlert("Error!", "Gagal mengambil data karyawan!", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectKaryawan = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setKaryawan(result.data || null);
        return result.data;
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Gagal mengambil data karyawan:", error);
      showAlert("Error!", "Gagal mengambil data karyawan!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addKaryawan = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        if (result.errors) {
          return { success: false, errors: result.errors };
        }
        showAlert("Gagal!", result.message, "error");
        return { success: false, errors: {} };
      }

      showAlert("Berhasil!", "Karyawan berhasil ditambahkan.", "success").then(() => {
        fetchKaryawan();
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal menambahkan karyawan:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    }
  };

  const updateKaryawan = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
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

      showAlert("Berhasil!", "Data karyawan berhasil diperbarui.", "success").then(() => {
        fetchKaryawan();
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal memperbarui data karyawan:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    } finally {
      setLoading(false);
    }
  };

  const deleteKaryawan = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus karyawan ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Karyawan berhasil dihapus.", "success").then(() => {
        fetchKaryawan();
      });

      return true;
    } catch (error) {
      console.error("Gagal menghapus karyawan:", error);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { karyawanList, karyawan, loading, fetchKaryawan, addKaryawan, updateKaryawan, deleteKaryawan, selectKaryawan };
}
