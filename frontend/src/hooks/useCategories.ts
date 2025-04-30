import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useCategories() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔥 Fetch semua Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        setCategoriesList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        showAlert("Error!", result.message, "error");
      } else {
        setCategoriesList([]);
      }
    } catch (error) {
      console.error("Error mengambil data kategori:", error);
      showAlert("Error!", "Gagal mengambil data kategori!", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectCategories = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setCategories(result.data || null);
        return result.data;
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Error mengambil detail kategori:", error);
      showAlert("Error!", "Gagal mengambil detail kategori!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 Tambah kategori baru
  const addCategories = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
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

      showAlert("Berhasil!", "Kategori berhasil ditambahkan.", "success").then(() => {
        fetchCategories();
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Error menambahkan kategori:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi error, coba lagi!", "error");
      return { success: false };
    }
  };

  // 🔥 Update kategori
  const updateCategories = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "PATCH",
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

      showAlert("Berhasil!", "Kategori berhasil diperbarui.", "success").then(() => {
        fetchCategories();
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Error memperbarui kategori:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi error, coba lagi!", "error");
      return { success: false };
    }
  };

  // 🔥 Soft delete kategori
  const deleteCategories = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus kategori ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Kategori berhasil dihapus.", "success").then(() => {
        fetchCategories();
      });

      return true;
    } catch (error) {
      console.error("Error menghapus kategori:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi error, coba lagi!", "error");
      return false;
    }
  };

  return {
    categoriesList,
    categories,
    loading,
    fetchCategories,
    addCategories,
    updateCategories,
    deleteCategories,
    selectCategories,
  };
}
